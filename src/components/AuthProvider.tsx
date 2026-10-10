import { useEffect, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { AUTH_ENABLED, AuthContext } from '../hooks/useAuth';

// The Firebase SDK is loaded in its own chunk, after the first render
const loadAuth = () => import('../services/auth');

const logout = async () => {
  await (await loadAuth()).logOut();
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(AUTH_ENABLED);

  useEffect(() => {
    if (!AUTH_ENABLED) return;
    let active = true;
    let unsubscribe = () => {};
    loadAuth().then(({ onUserChange }) => {
      if (!active) return;
      unsubscribe = onUserChange((nextUser) => {
        setUser(nextUser);
        setLoading(false);
      });
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>;
};
