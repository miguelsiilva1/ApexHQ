import { fetchFromAPI } from './api';
import type { ErgastResponse } from '../types/api.types';

// Jolpica caps pages at 100 rows; pages are fetched one by one to respect its rate limit
export async function fetchAllPages(fetchPage: (offset: number) => Promise<ErgastResponse>) {
  const pages: ErgastResponse[] = [];
  let offset = 0;
  let total = Infinity;
  while (offset < total) {
    const page = await fetchPage(offset);
    pages.push(page);
    total = Number(page.MRData.total);
    offset += Number(page.MRData.limit);
  }
  return pages;
}

export const service = {
  getCurrentStandings: async () => {
    return fetchFromAPI<ErgastResponse>('/current/driverStandings');
  },

  getDriverStandingsBySeason: async (season: string | number) => {
    return fetchFromAPI<ErgastResponse>(`/${season}/driverStandings`);
  },

  getConstructorStandingsBySeason: async (season: string | number) => {
    return fetchFromAPI<ErgastResponse>(`/${season}/constructorStandings`);
  },

  getFastestLapsBySeason: async (season: string | number) => {
    return fetchFromAPI<ErgastResponse>(`/${season}/fastest/1/results`);
  },

  getNextRace: async () => {
    return fetchFromAPI<ErgastResponse>('/current/next');
  },

  getCurrentDrivers: async () => {
    return fetchFromAPI<ErgastResponse>('/current/drivers');
  },
  
  getCalendarBySeason: async (season: string | number) => {
    return fetchFromAPI<ErgastResponse>(`/${season}`);
  },

  getCurrentCalendar: async () => {
    return fetchFromAPI<ErgastResponse>('/current');
  },

  getCircuit: async (circuitId: string) => {
    return fetchFromAPI<ErgastResponse>(`/circuits/${circuitId}`);
  },

  getCircuitWinners: async (circuitId: string, offset = 0) => {
    return fetchFromAPI<ErgastResponse>(`/circuits/${circuitId}/results/1?limit=100&offset=${offset}`);
  },

  getCircuitFastestLaps: async (circuitId: string, offset = 0) => {
    return fetchFromAPI<ErgastResponse>(`/circuits/${circuitId}/fastest/1/results?limit=100&offset=${offset}`);
  },

  getLastRaceResults: async () => {
    return fetchFromAPI<ErgastResponse>('/current/last/results');
  },

  getRaceResults: async (round: string | number) => {
    return fetchFromAPI<ErgastResponse>(`/current/${round}/results`);
  },

  getSeasonConstructors: async (season: string | number) => {
    return fetchFromAPI<ErgastResponse>(`/${season}/constructors`);
  },

  getSeasonConstructorDrivers: async (season: string | number, constructorId: string) => {
    return fetchFromAPI<ErgastResponse>(`/${season}/constructors/${constructorId}/drivers`);
  },

  getDriver: async (driverId: string) => {
    return fetchFromAPI<ErgastResponse>(`/drivers/${driverId}`);
  },

  getDriverResults: async (driverId: string, offset: number) => {
    return fetchFromAPI<ErgastResponse>(`/drivers/${driverId}/results?limit=100&offset=${offset}`);
  },

  getConstructor: async (constructorId: string) => {
    return fetchFromAPI<ErgastResponse>(`/constructors/${constructorId}`);
  },

  getConstructorSeasons: async (constructorId: string) => {
    return fetchFromAPI<ErgastResponse>(`/constructors/${constructorId}/seasons?limit=100`);
  },

  // Uses MRData.total, so only one row is requested
  getConstructorResultCount: async (constructorId: string, filter: string) => {
    const response = await fetchFromAPI<ErgastResponse>(`/constructors/${constructorId}/${filter}?limit=1`);
    return Number(response.MRData.total);
  },

  getAllDrivers: async (offset: number) => {
    return fetchFromAPI<ErgastResponse>(`/drivers?limit=100&offset=${offset}`);
  },

  getAllConstructors: async (offset: number) => {
    return fetchFromAPI<ErgastResponse>(`/constructors?limit=100&offset=${offset}`);
  }
};
