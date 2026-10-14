import { createContext, useContext } from 'react';
import { EMPTY_FAVORITES, type FavoriteKind, type Favorites } from '../types/favorites.types';

interface FavoritesState {
  favorites: Favorites;
  loading: boolean;
  toggleFavorite: (kind: FavoriteKind, id: string, name: string) => Promise<void>;
}

export const FavoritesContext = createContext<FavoritesState>({
  favorites: EMPTY_FAVORITES,
  loading: false,
  toggleFavorite: async () => {},
});

export const useFavorites = () => useContext(FavoritesContext);
