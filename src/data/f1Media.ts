// Local images for the current grid, keyed by Ergast driverId / constructorId (file name)
const byFileName = (modules: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(modules).map(([path, src]) => [path.split('/').pop()!.replace(/\.(webp|svg)$/, ''), src])
  );

export const CURRENT_SEASON = '2026';

export const driverImages: Record<string, string> = byFileName(
  import.meta.glob('../assets/drivers/*.webp', { eager: true, import: 'default' })
);

export const teamLogos: Record<string, string> = byFileName(
  import.meta.glob('../assets/teams/logos/*.webp', { eager: true, import: 'default' })
);

// Cars and driver photos are only valid for CURRENT_SEASON
export const teamCars: Record<string, string> = byFileName(
  import.meta.glob('../assets/teams/cars/*.webp', { eager: true, import: 'default' })
);

// Keyed by Ergast circuitId. Outlines are dark (use dark:invert); detailed maps need a light background
export const trackOutlines: Record<string, string> = byFileName(
  import.meta.glob('../assets/tracks/outline/*.svg', { eager: true, import: 'default', query: '?url' })
);

export const trackMaps: Record<string, string> = byFileName(
  import.meta.glob('../assets/tracks/detailed/*.webp', { eager: true, import: 'default' })
);

export const teamColors: Record<string, string> = {
  mercedes: '#00D7B6',
  ferrari: '#ED1131',
  mclaren: '#F47600',
  red_bull: '#4781D7',
  aston_martin: '#229971',
  alpine: '#00A1E8',
  williams: '#1868DB',
  haas: '#9C9FA2',
  rb: '#6C98FF',
  audi: '#F50537',
  cadillac: '#AAAAAD',
  sauber: '#01C00E',
  alphatauri: '#5E8FAA',
  alfa: '#C92D4B',
  renault: '#FFF500',
  racing_point: '#F596C8',
};

export const DEFAULT_TEAM_COLOR = '#FF1E00';
