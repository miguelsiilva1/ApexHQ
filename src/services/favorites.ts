import { deleteField, doc, getFirestore, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { app } from './firebase';
import { EMPTY_FAVORITES, type FavoriteKind, type Favorites } from '../types/favorites.types';

// One document per user: users/{uid} = { drivers: { id: name }, teams: { id: name } }
const db = getFirestore(app);
const userDoc = (uid: string) => doc(db, 'users', uid);

export const onFavoritesChange = (uid: string, callback: (favorites: Favorites) => void) =>
  onSnapshot(userDoc(uid), (snapshot) => {
    const data = snapshot.data();
    callback({ drivers: data?.drivers ?? {}, teams: data?.teams ?? {} });
  }, () => callback(EMPTY_FAVORITES));

export const addFavorite = (uid: string, kind: FavoriteKind, id: string, name: string) =>
  setDoc(userDoc(uid), { [kind]: { [id]: name } }, { merge: true });

export const removeFavorite = (uid: string, kind: FavoriteKind, id: string) =>
  updateDoc(userDoc(uid), { [`${kind}.${id}`]: deleteField() });
