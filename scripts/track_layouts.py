"""Generates the interactive track layouts in src/data/tracks/<circuitId>.json from FastF1 data.

Run once per season (or when a new circuit joins the calendar):
    python -m venv .venv && .venv/bin/pip install -r scripts/requirements.txt
    .venv/bin/python scripts/track_layouts.py [circuitId ...]

For each circuit with an outline in src/assets/tracks/outline, the most recent qualifying held at it
gives the racing line, sectors, corners and speed trace. DRS was abolished in 2026, so DRS zones
come from the most recent qualifying up to 2025.
"""
import json
import logging
import sys
from datetime import date
from pathlib import Path

import fastf1
import numpy as np
import pandas as pd
from fastf1.ergast import Ergast

ROOT = Path(__file__).resolve().parent.parent
OUTLINES = ROOT / 'src' / 'assets' / 'tracks' / 'outline'
OUTPUT = ROOT / 'src' / 'data' / 'tracks'
CACHE = ROOT / '.fastf1-cache'

FIRST_YEAR = 2023
LAST_DRS_YEAR = 2025
POINTS = 400  # samples along the lap
WIDTH = 1000  # viewBox width; height follows the track's aspect ratio
PADDING = 60
CORNER_OFFSET = 600  # metres between a corner and its label, as in the FastF1 examples

logging.getLogger('fastf1').setLevel(logging.ERROR)


def rotate(xy, angle_deg):
    angle = np.radians(angle_deg)
    return xy @ np.array([[np.cos(angle), np.sin(angle)], [-np.sin(angle), np.cos(angle)]])


def latest_events(circuit_ids):
    """Most recent completed race weekend per circuit: {circuitId: [(year, round), ...]} newest first."""
    ergast = Ergast()
    events = {}
    for year in range(date.today().year, FIRST_YEAR - 1, -1):
        schedule = ergast.get_race_schedule(year)
        for _, race in schedule.iterrows():
            if race['circuitId'] in circuit_ids and race['raceDate'].date() < date.today():
                events.setdefault(race['circuitId'], []).append((year, int(race['round'])))
    return events


def fastest_lap(year, rnd):
    session = fastf1.get_session(year, rnd, 'Q')
    session.load(laps=True, telemetry=True, weather=False, messages=False)
    lap = session.laps.pick_fastest()
    return session, lap, lap.get_telemetry()


def resample(tel):
    """Evenly spaced samples by distance, so every circuit has the same number of points."""
    distance = tel['Distance'].to_numpy()
    grid = np.linspace(distance[0], distance[-1], POINTS)
    xy = np.column_stack([np.interp(grid, distance, tel['X']), np.interp(grid, distance, tel['Y'])])
    speed = np.interp(grid, distance, tel['Speed'])
    return grid, xy, speed


def sector_ends(lap, tel, grid):
    """Indices of the samples where sectors 1 and 2 end."""
    ends = []
    for column in ('Sector1SessionTime', 'Sector2SessionTime'):
        reached = tel.index[tel['SessionTime'] >= lap[column]]
        distance = tel.loc[reached[0], 'Distance'] if len(reached) else grid[-1]
        ends.append(int(np.searchsorted(grid, distance)))
    return ends


def drs_zones(tel, path_xy):
    """[start, end] sample ranges where DRS was open, projected onto the reference path.
    A zone can cross the finish line, in which case start > end."""
    open_ = (tel['DRS'] >= 10).to_numpy()
    xy = tel[['X', 'Y']].to_numpy()
    if open_.all() or not open_.any():
        return []
    # Start the scan where DRS is closed, so a zone split by the finish line is read as one
    shift = int(np.argmin(open_))
    open_, xy = np.roll(open_, -shift), np.roll(xy, -shift, axis=0)
    nearest = lambda p: int(np.argmin(((path_xy - p) ** 2).sum(axis=1)))
    zones, start = [], None
    for i, is_open in enumerate(np.append(open_, False)):
        if is_open and start is None:
            start = i
        elif not is_open and start is not None:
            if i - start > 5:  # ignore telemetry blips
                zones.append([nearest(xy[start]), nearest(xy[i - 1])])
            start = None
    return sorted(zones)


def circuit_info(session):
    """Corners and official orientation; FastF1 doesn't have them yet for brand-new circuits."""
    try:
        return session.get_circuit_info()
    except AttributeError:
        return None


def build(circuit_id, events):
    year, rnd = events[0]
    session, lap, tel = fastest_lap(year, rnd)
    circuit = circuit_info(session)
    grid, xy, speed = resample(tel)
    s1, s2 = sector_ends(lap, tel, grid)

    zones, drs_year = [], None
    for drs_year_candidate, drs_round in (e for e in events if e[0] <= LAST_DRS_YEAR):
        _, _, drs_tel = (session, lap, tel) if drs_year_candidate == year else fastest_lap(drs_year_candidate, drs_round)
        zones = drs_zones(drs_tel, xy)
        if zones:  # a wet qualifying has no DRS; try the previous year
            drs_year = drs_year_candidate
            break

    corners = circuit.corners if circuit else pd.DataFrame(columns=['X', 'Y', 'Number', 'Letter', 'Angle'])
    rotation = circuit.rotation if circuit else 0
    corner_xy = corners[['X', 'Y']].to_numpy(dtype=float).reshape(-1, 2)
    offsets = np.array([rotate(np.array([CORNER_OFFSET, 0]), a) for a in corners['Angle']]).reshape(-1, 2)
    label_xy = corner_xy + offsets

    # Rotate to the official orientation, flip Y for SVG and fit everything in the viewBox
    to_view = lambda p: rotate(p, rotation) * [1, -1]
    xy, corner_xy, label_xy = to_view(xy), to_view(corner_xy), to_view(label_xy)
    every = np.vstack([xy, label_xy])
    low, high = every.min(axis=0), every.max(axis=0)
    scale = (WIDTH - 2 * PADDING) / (high - low)[0]
    fit = lambda p: np.round((p - low) * scale + PADDING, 1)
    height = int(np.ceil((high - low)[1] * scale + 2 * PADDING))

    return {
        'circuitId': circuit_id,
        'year': year,
        'driver': lap['Driver'],
        'lapTime': lap['LapTime'].total_seconds(),
        'drsYear': drs_year,
        'viewBox': [0, 0, WIDTH, height],
        'points': fit(xy).tolist(),
        'speed': np.round(speed).astype(int).tolist(),
        'sectors': [s1, s2],
        'drsZones': zones,
        'corners': [
            {'number': f"{int(row.Number)}{row.Letter or ''}", 'at': fit(c).tolist(), 'label': fit(lbl).tolist()}
            for row, c, lbl in zip(corners.itertuples(), corner_xy, label_xy)
        ],
    }


def main():
    CACHE.mkdir(exist_ok=True)
    OUTPUT.mkdir(parents=True, exist_ok=True)
    fastf1.Cache.enable_cache(str(CACHE))

    circuit_ids = sys.argv[1:] or sorted(p.stem for p in OUTLINES.glob('*.svg'))
    events = latest_events(set(circuit_ids))
    for circuit_id in circuit_ids:
        if circuit_id not in events:
            print(f'skip {circuit_id}: no race since {FIRST_YEAR}')
            continue
        try:
            layout = build(circuit_id, events[circuit_id])
        except Exception as error:  # one bad session shouldn't stop the others
            print(f'fail {circuit_id}: {error}')
            continue
        (OUTPUT / f'{circuit_id}.json').write_text(json.dumps(layout, separators=(',', ':')))
        print(f"ok   {circuit_id}: {layout['year']} {layout['driver']}, DRS {layout['drsYear']}, {len(layout['drsZones'])} zones")


if __name__ == '__main__':
    main()
