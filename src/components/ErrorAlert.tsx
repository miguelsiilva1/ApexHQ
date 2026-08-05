import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ErrorAlertProps {
  message?: string;
  title?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  title,
  message,
  onRetry,
  className = ''
}) => {
  const { t } = useTranslation();
  
  const displayTitle = title || t('error.default_title', 'Algo correu mal');
  const displayMessage = message || t('error.default_msg', 'Ocorreu um erro ao processar a tua requisição. Verifica a tua ligação à internet e tenta novamente.');
  return (
    <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center gap-4 ${className}`}>
      <div className="text-f1-red shrink-0">
        <AlertCircle size={24} />
      </div>
      <div className="flex-1">
        <h3 className="text-red-800 dark:text-red-200 font-semibold mb-1 font-orbitron">{displayTitle}</h3>
        <p className="text-red-700 dark:text-red-300 text-sm font-inter">{displayMessage}</p>
      </div>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-2 md:mt-0 flex items-center gap-2 px-4 py-2 bg-f1-red hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
        >
          <RefreshCw size={16} />
          {t('error.retry')}
        </button>
      )}
    </div>
  );
};
