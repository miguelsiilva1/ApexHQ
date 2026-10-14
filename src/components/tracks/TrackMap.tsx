import { useMemo, useRef, useState, type PointerEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { TrackLayout } from '../../types/track.types';
import { formatLapTime } from '../../utils/format';

type Mode = 'sectors' | 'speed' | 'drs';

const MODES: Mode[] = ['sectors', 'speed', 'drs'];
const SECTOR_COLORS = ['#FF1E00', '#00A1E8', '#FFD12E'];
const DRS_COLOR = '#00D26A';
const HOVER_RADIUS = 40; // viewBox units

// Slow corners in blue, top speed in red
const speedColor = (speed: number, min: number, max: number) =>
  `hsl(${Math.round(220 - (220 * (speed - min)) / (max - min || 1))}, 90%, 55%)`;

// A range with from > to crosses the finish line and wraps around the lap
const toPath = (points: [number, number][], from: number, to: number) =>
  (from <= to ? points.slice(from, to + 1) : [...points.slice(from), ...points.slice(0, to + 1)])
    .map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('');

const midpoint = (from: number, to: number, length: number) =>
  Math.round(from <= to ? (from + to) / 2 : (from + to + length) / 2) % length;

interface TrackMapProps {
  layout: TrackLayout;
}

// Interactive circuit map: sectors, speed trace of a pole lap and DRS zones, with a hover read-out
const TrackMap = ({ layout }: TrackMapProps) => {
  const { t } = useTranslation();
  const svgRef = useRef<SVGSVGElement>(null);
  const [mode, setMode] = useState<Mode>('sectors');
  const [hovered, setHovered] = useState<number | null>(null);
  const [activeSector, setActiveSector] = useState<number | null>(null);

  const { points, speed, sectors, drsZones, corners, viewBox } = layout;
  const last = points.length - 1;
  const bounds = useMemo(() => [[0, sectors[0]], [sectors[0], sectors[1]], [sectors[1], last]], [sectors, last]);
  const minSpeed = Math.min(...speed);
  const maxSpeed = Math.max(...speed);
  const fullPath = useMemo(() => toPath(points, 0, last) + 'Z', [points, last]);
  const sectorOf = (index: number) => (index < sectors[0] ? 0 : index < sectors[1] ? 1 : 2);

  // Start line: a short bar across the track at the first point, perpendicular to the direction of travel
  const [sx, sy] = points[0];
  const [nx, ny] = points[2];
  const length = Math.hypot(nx - sx, ny - sy) || 1;
  const [px, py] = [-(ny - sy) / length * 16, (nx - sx) / length * 16];

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const matrix = svgRef.current?.getScreenCTM()?.inverse();
    if (!matrix) return;
    const cursor = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix);
    let best = -1;
    let bestDistance = HOVER_RADIUS ** 2;
    points.forEach(([x, y], i) => {
      const distance = (x - cursor.x) ** 2 + (y - cursor.y) ** 2;
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    });
    setHovered(best >= 0 ? best : null);
  };

  const dimmed = (sector: number) => activeSector !== null && activeSector !== sector;
  const hoveredPoint = hovered !== null ? points[hovered] : null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar} role="tablist" aria-label={t('track.map.title')}>
        {MODES.map((item) => (
          <button
            key={item}
            role="tab"
            aria-selected={mode === item}
            onClick={() => setMode(item)}
            className={`${styles.tab} ${mode === item ? styles.tab_active : ''}`}
          >
            {t(`track.map.mode_${item}`)}
          </button>
        ))}
      </div>

      <div className={styles.canvas}>
        <svg
          ref={svgRef}
          viewBox={viewBox.join(' ')}
          className="w-full h-auto touch-none"
          role="img"
          aria-label={t('track.map.aria', { driver: layout.driver, year: layout.year })}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHovered(null)}
        >
          {/* Track surface */}
          <path d={fullPath} fill="none" stroke="#2a2a2a" strokeWidth={26} strokeLinejoin="round" />

          {mode === 'sectors' && bounds.map(([from, to], i) => (
            <path
              key={i}
              d={toPath(points, from, to)}
              fill="none"
              stroke={SECTOR_COLORS[i]}
              strokeWidth={10}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={dimmed(i) ? 0.2 : 1}
              className="transition-opacity duration-200"
            />
          ))}

          {mode === 'speed' && points.slice(0, last).map((_, i) => (
            <path
              key={i}
              d={toPath(points, i, i + 1)}
              stroke={speedColor(speed[i], minSpeed, maxSpeed)}
              strokeWidth={10}
              strokeLinecap="round"
            />
          ))}

          {mode === 'drs' && (
            <>
              <path d={fullPath} fill="none" stroke="#555" strokeWidth={6} strokeLinejoin="round" />
              {drsZones.map(([from, to], i) => (
                <g key={i}>
                  <path d={toPath(points, from, to)} fill="none" stroke={DRS_COLOR} strokeWidth={12} strokeLinecap="round" />
                  <text
                    x={points[midpoint(from, to, points.length)][0]}
                    y={points[midpoint(from, to, points.length)][1] - 22}
                    className={styles.drs_label}
                    fill={DRS_COLOR}
                  >
                    DRS {i + 1}
                  </text>
                </g>
              ))}
            </>
          )}

          {/* Start / finish line */}
          <line x1={sx - px} y1={sy - py} x2={sx + px} y2={sy + py} stroke="#fff" strokeWidth={6} />

          {/* Corner numbers */}
          {corners.map((corner) => (
            <g key={corner.number}>
              <circle cx={corner.label[0]} cy={corner.label[1]} r={15} className={styles.corner_dot} />
              <text x={corner.label[0]} y={corner.label[1]} className={styles.corner_text}>{corner.number}</text>
            </g>
          ))}

          {hoveredPoint && (
            <circle cx={hoveredPoint[0]} cy={hoveredPoint[1]} r={11} fill="#fff" stroke="#0D0D0D" strokeWidth={4} pointerEvents="none" />
          )}
        </svg>

        {hovered !== null && hoveredPoint && (
          <div
            className={styles.tooltip}
            style={{ left: `${(hoveredPoint[0] / viewBox[2]) * 100}%`, top: `${(hoveredPoint[1] / viewBox[3]) * 100}%` }}
          >
            <span style={{ color: SECTOR_COLORS[sectorOf(hovered)] }}>{t('track.map.sector', { number: sectorOf(hovered) + 1 })}</span>
            <span className="text-white">{speed[hovered]} km/h</span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        {mode === 'sectors' && bounds.map((_, i) => (
          <button
            key={i}
            onMouseEnter={() => setActiveSector(i)}
            onMouseLeave={() => setActiveSector(null)}
            onFocus={() => setActiveSector(i)}
            onBlur={() => setActiveSector(null)}
            className={styles.legend_item}
          >
            <span className={styles.swatch} style={{ backgroundColor: SECTOR_COLORS[i] }} />
            {t('track.map.sector', { number: i + 1 })}
          </button>
        ))}

        {mode === 'speed' && (
          <div className="flex items-center gap-3 w-full max-w-md">
            <span>{minSpeed} km/h</span>
            <span
              className="h-2 flex-1 rounded-full"
              style={{ background: `linear-gradient(to right, ${[0, 0.25, 0.5, 0.75, 1].map((f) => speedColor(minSpeed + f * (maxSpeed - minSpeed), minSpeed, maxSpeed)).join(', ')})` }}
            />
            <span>{maxSpeed} km/h</span>
          </div>
        )}

        {mode === 'drs' && (
          <span>
            {layout.drsYear
              ? t('track.map.drs_note', { count: drsZones.length, year: layout.drsYear })
              : t('track.map.drs_none')}
          </span>
        )}
      </div>

      <p className={styles.footnote}>
        {t('track.map.reference', { driver: layout.driver, time: formatLapTime(layout.lapTime), year: layout.year })}
        {' · '}{t('track.map.hint')}
      </p>
    </div>
  );
};

const styles = {
  wrapper: "bg-[#0D0D0D] rounded-3xl p-4 sm:p-6 border border-gray-800",
  toolbar: "flex flex-wrap gap-2 mb-4",
  tab: "px-4 py-2 rounded-lg font-orbitron text-xs uppercase tracking-wider font-bold text-gray-400 border border-gray-700 hover:text-white hover:border-gray-500 transition-colors",
  tab_active: "!bg-f1-red !border-f1-red !text-white",
  canvas: "relative",
  corner_dot: "fill-[#1a1a1a] stroke-gray-500",
  corner_text: "fill-white font-orbitron text-[15px] font-bold [text-anchor:middle] [dominant-baseline:central] pointer-events-none select-none",
  drs_label: "font-orbitron text-[22px] font-bold [text-anchor:middle] pointer-events-none select-none",
  tooltip: "absolute -translate-x-1/2 -translate-y-[calc(100%+18px)] pointer-events-none bg-black/90 border border-gray-700 rounded-lg px-3 py-2 flex flex-col items-center font-orbitron text-xs font-bold whitespace-nowrap",
  legend: "flex flex-wrap items-center gap-4 mt-4 font-inter text-sm text-gray-300",
  legend_item: "inline-flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 transition-colors",
  swatch: "w-6 h-2 rounded-full",
  footnote: "mt-4 font-inter text-xs text-gray-500",
};

export default TrackMap;
