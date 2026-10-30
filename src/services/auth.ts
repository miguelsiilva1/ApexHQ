import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
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

export const signUp = async (email: string, password: string) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  // The account already exists at this point, so a failed email must not fail the sign-up
  sendEmailVerification(credential.user).catch(() => {});
  return credential;
};

export const signInWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());

export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

export const logOut = () => signOut(auth);
