import { useTranslation } from 'react-i18next';
import { Trophy, Calculator, Flag } from 'lucide-react';
import type { DriverStanding, ConstructorStanding, Race } from '../../types/api.types';

// Current points system: 25 for a race win, 8 for a sprint win (no fastest-lap point since 2025).
// A team can score at most 1st + 2nd.
const MAX_POINTS = {
  drivers: { race: 25, sprint: 8 },
  constructors: { race: 25 + 18, sprint: 8 + 7 },
};

interface Entry {
  id: string;
  name: string;
  points: number;
}

interface ChampionshipMathProps {
  drivers: DriverStanding[];
  constructors: ConstructorStanding[];
  // Season calendar and the last round counted in the standings
  races: Race[];
  round: number;
}

const ChampionshipMath = ({ drivers, constructors, races, round }: ChampionshipMathProps) => {
  const { t } = useTranslation();

  const remaining = races.filter((race) => Number(race.round) > round);
  const remainingSprints = remaining.filter((race) => race.Sprint).length;

  const driverEntries: Entry[] = drivers.map((s) => ({
    id: s.Driver.driverId,
    name: `${s.Driver.givenName} ${s.Driver.familyName}`,
    points: Number(s.points),
  }));
  const constructorEntries: Entry[] = constructors.map((s) => ({
    id: s.Constructor.constructorId,
    name: s.Constructor.name,
    points: Number(s.points),
  }));

  if (driverEntries.length === 0) return null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Calculator size={20} />
        <h3 className={styles.header_title}>{t('standings.math.title')}</h3>
      </div>

      {remaining.length > 0 && (
        <p className={styles.summary}>
          <Flag size={16} className="text-f1-red shrink-0" />
          {remainingSprints > 0
            ? t('standings.math.remaining', { races: remaining.length, sprints: remainingSprints })
            : t('standings.math.remaining_no_sprints', { races: remaining.length })}
        </p>
      )}

      <div className={styles.columns}>
        <TitleRace
          label={t('standings.drivers_championship')}
          entries={driverEntries}
          races={remaining.length}
          sprints={remainingSprints}
          max={MAX_POINTS.drivers}
        />
        <TitleRace
          label={t('standings.constructors_championship')}
          entries={constructorEntries}
          races={remaining.length}
          sprints={remainingSprints}
          max={MAX_POINTS.constructors}
        />
      </div>
    </div>
  );
};

interface TitleRaceProps {
  label: string;
  entries: Entry[];
  races: number;
  sprints: number;
  max: { race: number; sprint: number };
}

const TitleRace = ({ label, entries, races, sprints, max }: TitleRaceProps) => {
  const { t } = useTranslation();
  if (entries.length === 0) return null;

  const [leader, second] = entries;
  const available = races * max.race + sprints * max.sprint;
  // A tie on points still leaves a chance (decided on wins), so it counts as alive
  const contenders = entries.filter((e) => e.points + available >= leader.points);
  const lead = second ? leader.points - second.points : 0;

  if (contenders.length === 1) {
    return (
      <div className={styles.column}>
        <p className={styles.column_label}>{label}</p>
        <div className={styles.champion}>
          <Trophy size={28} className="text-yellow-500 shrink-0" />
          <div>
            <p className={styles.champion_name}>{leader.name}</p>
            <p className={styles.muted}>
              {races > 0 ? t('standings.math.clinched') : t('standings.math.champion')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // The leader clinches next weekend if, after the biggest possible swing in one weekend,
  // the gap is larger than everything still available after it
  const nextWeekend = max.race + (sprints > 0 ? max.sprint : 0);
  const canClinchNext = !!second && lead + nextWeekend > available - nextWeekend;

  return (
    <div className={styles.column}>
      <p className={styles.column_label}>{label}</p>
      <p className={styles.muted}>
        {t('standings.math.available', { points: available })} · {t('standings.math.contenders', { count: contenders.length })}
      </p>

      <ul className={styles.list}>
        {contenders.map((entry, index) => {
          const gap = leader.points - entry.points;
          // Full bar = level with the leader; empty = needs every remaining point
          const progress = available > 0 ? 100 - Math.round((gap / available) * 100) : 100;
          return (
            <li key={entry.id} className={styles.row}>
              <span className={styles.row_pos}>{index + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <span className={styles.row_name}>{entry.name}</span>
                  <span className={styles.row_points}>
                    {index === 0 ? `${entry.points} pts` : `−${gap}`}
                  </span>
                </div>
                <div className={styles.bar_track}>
                  <div className={styles.bar_fill} style={{ width: `${progress}%` }} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {canClinchNext && (
        <p className={styles.highlight}>{t('standings.math.match_point', { name: leader.name })}</p>
      )}
      <p className={styles.footnote}>{t('standings.math.bar_hint')}</p>
    </div>
  );
};

const styles = {
  card: "w-full bg-white dark:bg-[#151515] rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800 transition-colors duration-300",
  header: "bg-gradient-to-r from-f1-dark to-gray-800 p-4 flex items-center gap-3 text-white",
  header_title: "font-orbitron text-xl uppercase tracking-wider",
  summary: "flex items-center gap-2 px-6 pt-5 font-inter text-sm text-gray-600 dark:text-gray-400",
  columns: "grid grid-cols-1 md:grid-cols-2 gap-6 p-6",
  column: "flex flex-col gap-3 p-5 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800",
  column_label: "font-orbitron text-sm font-bold uppercase tracking-wider text-f1-red",
  muted: "font-inter text-sm text-gray-500 dark:text-gray-400",
  champion: "flex items-center gap-4 py-2",
  champion_name: "font-orbitron text-lg font-bold text-f1-dark dark:text-white uppercase",
  list: "flex flex-col gap-3",
  row: "flex items-center gap-3",
  row_pos: "font-orbitron font-bold text-sm text-gray-400 w-5 text-center",
  row_name: "font-inter text-sm font-semibold text-f1-dark dark:text-white truncate",
  row_points: "font-orbitron text-sm font-bold text-f1-red whitespace-nowrap",
  bar_track: "mt-1 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden",
  bar_fill: "h-full rounded-full bg-f1-red",
  highlight: "font-inter text-sm font-semibold text-f1-red bg-f1-red/10 rounded-lg px-3 py-2",
  footnote: "font-inter text-xs text-gray-400 dark:text-gray-500",
};

export default ChampionshipMath;
