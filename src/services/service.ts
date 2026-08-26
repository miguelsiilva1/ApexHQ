import { fetchFromAPI } from './api';
import type { ErgastResponse } from '../types/api.types';

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

  getCircuitWinners: async (circuitId: string) => {
    return fetchFromAPI<ErgastResponse>(`/circuits/${circuitId}/results/1?limit=200`);
  },

  getCircuitFastestLaps: async (circuitId: string) => {
    return fetchFromAPI<ErgastResponse>(`/circuits/${circuitId}/fastest/1/results?limit=200`);
  },

  getLastRaceResults: async () => {
    return fetchFromAPI<ErgastResponse>('/current/last/results');
  },

  getRaceResults: async (round: string | number) => {
    return fetchFromAPI<ErgastResponse>(`/current/${round}/results`);
  },

  getLatestNews: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            category: "Regulamentos",
            title: "O que muda nos motores em 2026?",
            excerpt: "Uma análise profunda aos novos regulamentos que prometem revolucionar a grelha de partida para a próxima geração.",
            imageUrl: "https://images.unsplash.com/photo-1541348263662-e06836264be4?w=800"
          },
          {
            id: 2,
            category: "Pilotos",
            title: "O Mercado de Transferências Aquece",
            excerpt: "Vários pilotos em fim de contrato começam já a procurar assento para a nova era da F1. Quem vai para onde?",
            imageUrl: "https://images.unsplash.com/photo-1517409028941-0edbb3a48e89?w=800"
          },
          {
            id: 3,
            category: "Equipas",
            title: "A Audi Prepara a sua Entrada Oficial",
            excerpt: "A gigante alemã continua os preparativos intensivos para a sua estreia em 2026. Conhece os bastidores.",
            imageUrl: "https://images.unsplash.com/photo-1532906103632-478a59489fc9?w=800"
          }
        ]);
      }, 1500); 
    });
  }
};
