import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Race } from '../../types/api.types';

// Map of circuit IDs to track layout images
const trackImageMap: Record<string, string> = {
  bahrain: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Bahrain_International_Circuit--Grand_Prix_Layout.svg',
  jeddah: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Jeddah_Street_Circuit_2021.svg',
  albert_park: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Albert_Park_Circuit_2021.svg',
  suzuka: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Suzuka_circuit_map--2005.svg',
  shanghai: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Shanghai_International_Racing_Circuit_track_map.svg',
  miami: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Miami_International_Autodrome.svg',
  imola: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Imola_2022_layout.svg',
  monaco: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Monte_Carlo_Formula_1_track_map.svg',
  villeneuve: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Circuit_Gilles_Villeneuve.svg',
  catalunya: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Catalunya.svg',
  red_bull_ring: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Circuit_Red_Bull_Ring.svg',
  silverstone: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Silverstone_Circuit_2020.png',
  hungaroring: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Hungaroring.svg',
  spa: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Spa-Francorchamps_of_Belgium.svg',
  zandvoort: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Circuit_Zandvoort.svg',
  monza: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Monza_track_map.svg',
  baku: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Baku_Formula_One_circuit_map.svg',
  marina_bay: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Singapore_Street_Circuit_2023.svg',
  americas: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Austin_circuit.svg',
  rodriguez: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez_2015.svg',
  interlagos: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Circuit_Interlagos.svg',
  vegas: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Las_Vegas_Street_Circuit_2023.svg',
  losail: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Losail_International_Circuit.svg',
  yas_marina: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Yas_Marina_Circuit.svg',
};

// Generic fallback track image
const FALLBACK_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/F1_track_icon.svg/512px-F1_track_icon.svg.png';

interface RaceCardProps {
  race: Race;
}

const RaceCard = ({ race }: RaceCardProps) => {
  const { t } = useTranslation();
  const circuitId = race.Circuit.circuitId;
  const trackImage = trackImageMap[circuitId] || FALLBACK_IMAGE;

  // Format date correctly
  const raceDate = new Date(`${race.date}T${race.time || '15:00:00Z'}`);
  const formattedDate = new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(raceDate);
  
  const formattedTime = new Intl.DateTimeFormat('pt-PT', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(raceDate);

  return (
    <div className="bg-white dark:bg-[#151515] rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-2xl hover:border-f1-red/50 group flex flex-col h-full">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-[#1a1a1a] p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <span className="font-orbitron font-bold text-f1-red text-lg uppercase">
          {t('calendar.round')} {race.round}
        </span>
        <span className="bg-f1-red/10 text-f1-red px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          {race.season}
        </span>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        {/* Track Title */}
        <h3 className="font-orbitron text-xl font-bold text-f1-dark dark:text-white mb-2 leading-tight min-h-[50px]">
          {t(`api.gps.${race.raceName}`, race.raceName)}
        </h3>

        {/* Info items */}
        <div className="flex flex-col gap-3 mb-6 font-inter text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-f1-red flex-shrink-0" />
            <span className="truncate">
              {race.Circuit.circuitName}, {t(`api.countries.${race.Circuit.Location.country}`, race.Circuit.Location.country)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-f1-red flex-shrink-0" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-f1-red flex-shrink-0" />
            <span>{formattedTime} (Local)</span>
          </div>
        </div>

        {/* Track Image (Placeholder style) */}
        <div className="mt-auto pt-4 flex-grow flex items-center justify-center p-4 bg-gray-50 dark:bg-black/20 rounded-xl mb-6 min-h-[250px]">
          <img 
            src={trackImage} 
            alt={race.Circuit.circuitName} 
            className="max-h-[200px] max-w-full object-contain filter dark:invert opacity-80 group-hover:opacity-100 transition-opacity"
            onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
          />
        </div>

        {/* Action Button */}
        <Link 
          to={`/pistas/${circuitId}`}
          className="w-full py-3 px-4 flex items-center justify-center gap-2 font-orbitron font-bold uppercase tracking-wider text-sm rounded-lg border-2 border-gray-200 dark:border-gray-800 text-f1-dark dark:text-white hover:bg-f1-red hover:border-f1-red hover:text-white transition-all duration-300"
        >
          {t('calendar.view_details')}
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default RaceCard;
