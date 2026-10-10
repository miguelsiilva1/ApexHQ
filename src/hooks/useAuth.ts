import { createContext, useContext } from 'react';
import type { User } from 'firebase/auth';

// Without the Firebase keys (see .env.example) the app runs normally and login is unavailable
export const AUTH_ENABLED = Boolean(import.meta.env.VITE_FIREBASE_API_KEY);

interface AuthState {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthState>({
  user: null,
  loading: false,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);
