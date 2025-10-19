import * as SecureStore from 'expo-secure-store';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';

export const guardarUbicacion = async (coords) => {
    try {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error('Usuario no autenticado');
        const jsonCoordenadas = JSON.stringify(coords);
        await SecureStore.setItemAsync('ubicacion', jsonCoordenadas);
        guardarCoordenadas(coords);

    } catch (error) {
        console.log("error al guardar las coordenadas")
    }
}
const guardarCoordenadas = async (coords) => {
    try {
        await addDoc(collection(db, 'coordenadas'), {
            uid: auth.currentUser?.uid,
            latitude: coords.latitude,
            longitude: coords.longitude,
            timestamp: new Date()
        });
    } catch (error) {
        console.log('Error al guardar las coordenadas en Firestore:', error);
    }
};