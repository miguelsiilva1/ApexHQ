import { Link } from 'react-router-dom';
import type { Constructor, Driver } from '../../types/api.types';
import EntityImage from './EntityImage';
import { driverImages, teamLogos, teamCars, teamColors, DEFAULT_TEAM_COLOR, CURRENT_SEASON } from '../../data/f1Media';

export interface TeamEntry {
  constructor: Constructor;
  drivers: Driver[];
}

interface TeamCardProps {
  team: TeamEntry;
  season: string;
}

const TeamCard = ({ team, season }: TeamCardProps) => {
  const { constructor, drivers } = team;
  const color = teamColors[constructor.constructorId] || DEFAULT_TEAM_COLOR;
  // Local photos and cars show the current season's liveries, so older seasons use Wikipedia
  const isCurrent = season === CURRENT_SEASON;
  const car = isCurrent ? teamCars[constructor.constructorId] : undefined;

  return (
    <div className={styles.card} style={{ borderTopColor: color }}>
      {/* Team Header */}
      <Link to={`/equipas/${constructor.constructorId}`} className={styles.card_header}>
        <h2 className={styles.team_name}>{constructor.name}</h2>
        <div className={styles.team_logo_wrapper}>
          <EntityImage
            localSrc={teamLogos[constructor.constructorId]}
            alt={`${constructor.name} Logo`}
            placeholder={constructor.name.charAt(0)}
            className={styles.team_logo}
            placeholderClassName="rounded-lg text-lg"
          />
        </div>
      </Link>

      <div className={styles.card_body}>
        {/* Drivers */}
        <div className={styles.drivers_row}>
          {drivers.map((driver) => (
            <Link key={driver.driverId} to={`/pilotos/${driver.driverId}`} className={styles.driver_container}>
              <div className={styles.driver_image_wrapper} style={{ ['--team-color' as string]: color }}>
                <EntityImage
                  localSrc={isCurrent ? driverImages[driver.driverId] : undefined}
                  wikiUrl={driver.url}
                  alt={`${driver.givenName} ${driver.familyName}`}
                  placeholder={driver.permanentNumber || driver.code || driver.familyName.charAt(0)}
                  className={styles.driver_image}
                  placeholderClassName="text-3xl"
                />
              </div>
              <h3 className={styles.driver_name}>
                {driver.givenName} <br />
                <span className="uppercase" style={{ color }}>{driver.familyName}</span>
              </h3>
              {driver.permanentNumber && (
                <span className={styles.driver_number_badge}>#{driver.permanentNumber}</span>
              )}
            </Link>
          ))}
        </div>

        {/* Car */}
        {car && (
          <div className={styles.car_wrapper}>
            <img src={car} alt={`${constructor.name} Car`} className={styles.car_image} loading="lazy" />
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: "bg-white dark:bg-[#151515] rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800 border-t-4 hover:shadow-2xl transition-all duration-300 group flex flex-col",
  card_header: "bg-gray-50 dark:bg-[#1a1a1a] p-4 flex items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-[#202020] transition-colors",
  team_name: "font-orbitron text-xl md:text-2xl font-bold text-f1-dark dark:text-white uppercase tracking-wider",
  team_logo_wrapper: "h-10 w-10 md:h-12 md:w-12 flex-shrink-0 flex items-center justify-center",
  team_logo: "max-h-full max-w-full object-contain opacity-90 group-hover:opacity-100 transition-opacity",

  card_body: "p-6 flex flex-col gap-6 flex-grow",
  drivers_row: "flex flex-wrap justify-around items-start gap-6",
  driver_container: "text-center flex flex-col items-center group/driver",
  driver_image_wrapper: "relative w-24 h-24 md:w-32 md:h-32 mb-3 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-800 group-hover/driver:border-[var(--team-color)] group-hover/driver:scale-105 transition-all duration-300 bg-gradient-to-b from-gray-100 to-transparent dark:from-white/10",
  driver_image: "w-full h-full object-cover object-top",
  driver_name: "font-bold text-f1-dark dark:text-white text-lg leading-tight font-inter",
  driver_number_badge: "text-xs font-bold font-orbitron bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded mt-2 text-gray-500 dark:text-gray-400",

  car_wrapper: "mt-auto flex justify-center pointer-events-none",
  car_image: "w-[90%] md:w-[80%] object-contain transform group-hover:scale-105 group-hover:-translate-y-1 transition-transform duration-500 ease-out",
};

export default TeamCard;
