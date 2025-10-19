import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { Camera } from 'expo-camera';

export const solicitarPermiso = async () => {
    console.log("dentro permiso ubi")
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permiso denegado');
        return false;
    }
    console.log("permiso ubi permitido")
    return true;
};

export const solicitarPermisoCamara = async () => {
    console.log("dentro de la funcion permiso camara")
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert("permiso denegado");
        console.log("permiso de camara denegado");
        return false;
    }
    console.log("permiso de camara permitido");
    return true;
};