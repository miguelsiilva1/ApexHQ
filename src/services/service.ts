import { fetchFromAPI } from './api';
import type { ErgastResponse } from '../types/api.types';

export const service = {
  getCurrentStandings: async () => {
    return fetchFromAPI<ErgastResponse>('/current/driverStandings');
  },

  getNextRace: async () => {
    return fetchFromAPI<ErgastResponse>('/current/next');
  },

  getCurrentDrivers: async () => {
    return fetchFromAPI<ErgastResponse>('/current/drivers');
  },
  
  getCurrentCalendar: async () => {
    return fetchFromAPI<ErgastResponse>('/current');
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
