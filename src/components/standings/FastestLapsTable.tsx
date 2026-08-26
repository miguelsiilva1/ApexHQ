import { useTranslation } from 'react-i18next';
import { Timer } from 'lucide-react';
import type { Race } from '../../types/api.types';

interface FastestLapsTableProps {
  races: Race[];
  loading: boolean;
}

const FastestLapsTable = ({ races, loading }: FastestLapsTableProps) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="w-full bg-white/50 dark:bg-[#151515]/50 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 animate-pulse h-96 flex items-center justify-center">
        <p className="text-gray-500 font-inter">{t('standings.loading')}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-[#151515] rounded-2xl shadow-xl overflow-hidden border border-[#ffcc00]/30 transition-colors duration-300 flex flex-col relative group">
      
      <div className="bg-gradient-to-r from-[#d40511] to-[#a3000b] p-4 flex items-center gap-3">
        <Timer className="text-[#ffcc00]" size={24} />
        <h3 className="font-orbitron text-xl text-white uppercase tracking-wider">
          {t('standings.fastest_lap_award')}
        </h3>
      </div>
      
      <div className="overflow-x-auto flex-grow">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-[#1a1a1a] text-gray-500 dark:text-gray-400 font-inter text-xs uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
              <th className="p-3 pl-4">{t('results.stage')}</th>
              <th className="p-3">GP</th>
              <th className="p-3">{t('standings.driver')}</th>
              <th className="p-3 text-right pr-4">Tempo</th>
            </tr>
          </thead>
          <tbody className="font-inter text-sm divide-y divide-gray-100 dark:divide-gray-800">
            {races.map((race) => {
              const fastestResult = race.Results?.[0];
              if (!fastestResult) return null;
              
              return (
                <tr 
                  key={race.round} 
                  className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors duration-200"
                >
                  <td className="p-3 pl-4 text-center text-gray-400 font-orbitron text-xs">
                    R{race.round}
                  </td>
                  <td className="p-3 font-semibold text-f1-dark dark:text-gray-300 text-xs">
                    {t(`api.gps.${race.raceName}`, race.raceName)}
                  </td>
                  <td className="p-3 text-f1-dark dark:text-white font-semibold">
                    {fastestResult.Driver.givenName} <span className="uppercase">{fastestResult.Driver.familyName}</span>
                  </td>
                  <td className="p-3 pr-4 text-right font-orbitron font-bold text-[#d40511] dark:text-[#ffcc00]">
                    {fastestResult.FastestLap?.Time?.time || '-'}
                  </td>
                </tr>
              );
            })}
            
            {races.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500 font-inter">
                  Nenhuma volta mais rápida registada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FastestLapsTable;
