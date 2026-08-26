import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SeasonSelectorProps {
  currentSeason: string;
  onSeasonChange: (season: string) => void;
  availableSeasons?: string[];
}

const SeasonSelector = ({ currentSeason, onSeasonChange, availableSeasons = ["2026", "2025", "2024", "2023", "2022", "2021", "2020"] }: SeasonSelectorProps) => {
  const { t } = useTranslation();

  return (
    <div className="relative inline-block text-left w-full sm:w-auto">
      <div className="flex items-center gap-2">
        <label htmlFor="season-select" className="text-f1-dark dark:text-gray-400 font-inter text-sm">
          {t('standings.select_season')}:
        </label>
        <div className="relative">
          <select
            id="season-select"
            value={currentSeason}
            onChange={(e) => onSeasonChange(e.target.value)}
            className="appearance-none bg-white dark:bg-[#151515] border border-gray-200 dark:border-gray-800 text-f1-dark dark:text-white font-orbitron py-2 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-f1-red focus:border-transparent transition-all cursor-pointer"
          >
            {availableSeasons.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-f1-red">
            <ChevronDown size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonSelector;
