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
