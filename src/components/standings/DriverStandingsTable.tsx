import { useTranslation } from 'react-i18next';
import type { DriverStanding } from '../../types/api.types';

interface DriverStandingsTableProps {
  standings: DriverStanding[];
  loading: boolean;
}

const DriverStandingsTable = ({ standings, loading }: DriverStandingsTableProps) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="w-full bg-white/50 dark:bg-[#151515]/50 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 animate-pulse h-96 flex items-center justify-center">
        <p className="text-gray-500 font-inter">{t('standings.loading')}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-[#151515] rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800 transition-colors duration-300 flex flex-col">
      <div className="bg-gradient-to-r from-f1-red to-red-800 p-4">
        <h3 className="font-orbitron text-xl text-white uppercase tracking-wider">
          {t('standings.drivers_championship')}
        </h3>
      </div>
      
      <div className="overflow-x-auto flex-grow">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-[#1a1a1a] text-gray-500 dark:text-gray-400 font-inter text-xs uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
              <th className="p-4 w-16 text-center">{t('standings.position')}</th>
              <th className="p-4">{t('standings.driver')}</th>
              <th className="p-4">{t('standings.constructor')}</th>
              <th className="p-4 text-center">{t('standings.wins')}</th>
              <th className="p-4 text-right">{t('standings.points')}</th>
            </tr>
          </thead>
          <tbody className="font-inter text-sm divide-y divide-gray-100 dark:divide-gray-800">
            {standings.map((standing) => (
              <tr 
                key={standing.Driver.driverId} 
                className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors duration-200"
              >
                <td className="p-4 text-center font-orbitron font-bold text-f1-dark dark:text-gray-300">
                  {standing.position}
                </td>
                <td className="p-4 font-semibold text-f1-dark dark:text-white">
                  {standing.Driver.givenName} <span className="uppercase">{standing.Driver.familyName}</span>
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-400">
                  {standing.Constructors[0]?.name || '-'}
                </td>
                <td className="p-4 text-center text-gray-500 dark:text-gray-500">
                  {standing.wins}
                </td>
                <td className="p-4 text-right font-orbitron font-bold text-f1-red">
                  {standing.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverStandingsTable;
