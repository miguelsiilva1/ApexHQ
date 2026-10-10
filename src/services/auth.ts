import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';

// Firebase web config is public by design; access is controlled by the Firebase project settings
const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});

const auth = getAuth(app);

export const onUserChange = (callback: (user: User | null) => void) => onAuthStateChanged(auth, callback);

export const signIn = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);

export const signUp = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);

export const signInWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());

export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

export const logOut = () => signOut(auth);
