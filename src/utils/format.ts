import type { TFunction } from 'i18next';
import type { Circuit } from '../types/api.types';

export const formatNewsDate = (date: string, language: string) =>
  new Intl.DateTimeFormat(language === 'en' ? 'en-GB' : 'pt-PT', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));

// Ergast IDs (drivers, constructors, circuits) are lowercase words joined by _ or -.
// Route params are checked before they are placed in an API path.
export const isValidId = (id: string | undefined): id is string => !!id && /^[a-z0-9_-]{1,64}$/i.test(id);

// 81.786 -> "1:21.786"
export const formatLapTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${(seconds - minutes * 60).toFixed(3).padStart(6, '0')}`;
};

// Portuguese names live in api.circuits; English (and any circuit without one) keeps the official name
export const circuitName = (t: TFunction, circuit: Circuit) =>
  t(`api.circuits.${circuit.circuitId}`, circuit.circuitName);
