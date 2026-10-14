import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import { AUTH_ENABLED, useAuth } from '../../hooks/useAuth';
import { useFavorites } from '../../hooks/useFavorites';
import type { FavoriteKind } from '../../types/favorites.types';

interface FavoriteButtonProps {
  kind: FavoriteKind;
  id: string;
  name: string;
}

// Star toggle on driver and team pages; signed-out visitors are sent to the login and brought back
const FavoriteButton = ({ kind, id, name }: FavoriteButtonProps) => {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();
  const [busy, setBusy] = useState(false);

  if (!AUTH_ENABLED || authLoading) return null;

  const active = Boolean(favorites[kind][id]);
  const label = t(active ? 'favorites.remove' : 'favorites.add');

  const handleClick = async () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setBusy(true);
    try {
      await toggleFavorite(kind, id, name);
    } catch (err) {
      console.error('Failed to update favorites:', err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      aria-pressed={active}
      className={`${styles.button} ${active ? styles.active : styles.inactive}`}
    >
      <Star size={18} className={active ? 'fill-current' : ''} />
      {label}
    </button>
  );
};

const styles = {
  button: "inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-orbitron text-xs uppercase tracking-wider font-bold transition-colors disabled:opacity-60",
  active: "bg-f1-red border-f1-red text-white hover:bg-red-700",
  inactive: "border-white/30 text-white hover:border-f1-red hover:text-f1-red",
};

export default FavoriteButton;
