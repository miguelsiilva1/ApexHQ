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
import { app } from './firebase';

const auth = getAuth(app);

export const onUserChange = (callback: (user: User | null) => void) => onAuthStateChanged(auth, callback);

export const signIn = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);

export const signUp = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);

export const signInWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());

export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

export const logOut = () => signOut(auth);
