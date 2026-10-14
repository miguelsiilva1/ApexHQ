import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FavoritesContext } from '../hooks/useFavorites';
import { EMPTY_FAVORITES, type FavoriteKind, type Favorites } from '../types/favorites.types';

// Firestore is loaded in its own chunk, only once someone is signed in
const loadFavorites = () => import('../services/favorites');

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const uid = user?.uid;
  const [favorites, setFavorites] = useState<Favorites>(EMPTY_FAVORITES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFavorites(EMPTY_FAVORITES);
    if (!uid) return;
    setLoading(true);
    let active = true;
    let unsubscribe = () => {};
    loadFavorites().then(({ onFavoritesChange }) => {
      if (!active) return;
      unsubscribe = onFavoritesChange(uid, (next) => {
        setFavorites(next);
        setLoading(false);
      });
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [uid]);

  const toggleFavorite = useCallback(async (kind: FavoriteKind, id: string, name: string) => {
    if (!uid) return;
    const service = await loadFavorites();
    await (favorites[kind][id] ? service.removeFavorite(uid, kind, id) : service.addFavorite(uid, kind, id, name));
  }, [uid, favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, loading, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
