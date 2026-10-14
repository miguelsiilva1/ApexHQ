import type { TrackLayout } from '../types/track.types';

// Each layout is its own chunk, loaded only on its track page
const layouts = import.meta.glob<TrackLayout>('./tracks/*.json', { import: 'default' });

export const loadTrackLayout = (circuitId: string): Promise<TrackLayout | null> => {
  const load = layouts[`./tracks/${circuitId}.json`];
  return load ? load() : Promise.resolve(null);
};
