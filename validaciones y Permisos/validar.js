import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { Camera } from 'expo-camera';

//VALIDAMOS EL FORMATO DEL EAMIL
export const verificarEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

export const validarEdad = (edad) => {
    const numero = parseInt(edad, 10);
    return !isNaN(numero) && numero > 0 && numero < 130;
};

export const solicitarPermiso = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permiso denegado');
        return false;
    }
    return true;
};

export const solicitarPermisoCamara = async () => {
    const {status} = await Camera.requestCameraPermissionsAsync();
    if(status !== 'granted'){
        Alert.alert("permiso denegado");
        return false;
    }
    return true;
};

export const guardarUbicacion = async (coords) => {
    try {
        const jsonCoordenadas = JSON.stringify(coords);
        await SecureStore.setItemAsync('ubicacion', jsonCoordenadas);

    } catch (error) {
        console.log("error al guardar las coordenadas")
    }
}
