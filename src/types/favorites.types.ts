export type FavoriteKind = 'drivers' | 'teams';

// Ergast driverId / constructorId -> display name, so the profile can list them without API calls
export type Favorites = Record<FavoriteKind, Record<string, string>>;

export const EMPTY_FAVORITES: Favorites = { drivers: {}, teams: {} };
