import { useEffect, useState } from 'react';
import { service, fetchAllPages } from '../services/service';
import type { Constructor, Driver } from '../types/api.types';

interface F1Directory {
  drivers: Driver[];
  constructors: Constructor[];
}

const STORAGE_KEY = 'apexhq_directory';
let request: Promise<F1Directory> | null = null;

const loadDirectory = () => {
  if (!request) {
    request = (async () => {
      try {
        const cached = sessionStorage.getItem(STORAGE_KEY);
        if (cached) return JSON.parse(cached) as F1Directory;
      } catch {
        // storage unavailable, fall through to the API
      }

      const driverPages = await fetchAllPages(service.getAllDrivers);
      const constructorPages = await fetchAllPages(service.getAllConstructors);
      const directory: F1Directory = {
        drivers: driverPages.flatMap((page) => page.MRData.DriverTable?.Drivers || []),
        constructors: constructorPages.flatMap((page) => page.MRData.ConstructorTable?.Constructors || []),
      };

      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(directory));
      } catch {
        // not critical
      }
      return directory;
    })();
    request.catch(() => {
      request = null;
    });
  }
  return request;
};

// Every driver and constructor in the database, loaded once per session when `enabled`
export const useF1Directory = (enabled: boolean) => {
  const [directory, setDirectory] = useState<F1Directory | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!enabled || directory) return;
    let active = true;
    loadDirectory()
      .then((data) => active && setDirectory(data))
      .catch(() => active && setError(true));
    return () => {
      active = false;
    };
  }, [enabled, directory]);

  return { directory, loading: enabled && !directory && !error, error };
};
