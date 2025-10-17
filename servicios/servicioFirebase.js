
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const guardarPerfil = async (uid, datos) => {
  await setDoc(doc(db, 'usuarios', uid), datos);
};

export const obtenerPerfil = async (uid) => {
  const docRef = doc(db, 'usuarios', uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const actualizarPerfil = async (uid, nuevosDatos) => {
  await updateDoc(doc(db, 'usuarios', uid), nuevosDatos);
};

export const eliminarPerfil = async (uid) => {
  await deleteDoc(doc(db, 'usuarios', uid));
};
