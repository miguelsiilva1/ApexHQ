import { initializeApp } from 'firebase/app';

// Firebase web config is public by design; access is controlled by the Firebase project settings
// and by the Firestore rules in firestore.rules
export const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});
