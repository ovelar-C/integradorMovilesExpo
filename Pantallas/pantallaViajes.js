import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';

export default function ViajesPantalla({ navigation }) {
    const [coords, setCoords] = useState(null);
    const [obteniendo, setObteniendo] = useState(false);

    const solicitarPermiso = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado');
            return false;
        }
        return true;
    };

    const obtenerUbicacion = async () => {
        const permiso = await solicitarPermiso();
        if (!permiso) return;

        setObteniendo(true);
        try {
            const ubicacion = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            setCoords(ubicacion.coords);
            console.log('📍 Ubicación obtenida:', ubicacion.coords.latitude, ubicacion.coords.longitude);
            guardarUbicacion(ubicacion.coords);

        } catch (error) {
            console.error('Error al obtener ubicación:', error);
            Alert.alert('Error', 'No se pudo obtener la ubicación');
        } finally {
            setObteniendo(false);
        }
    };





    return (
        <View style={styles.contenedor}>
            <Text style={styles.titulo}>
                PANTALLA DE VIAJES
            </Text>
            <TouchableOpacity style={styles.boton}
                onPress={() => navigation.navigate('MisViajes')}>
                <Text style={styles.botonText}> MIS VIAJES</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.boton}
                onPress={()=> obtenerUbicacion()}
            >
                <Text style={styles.botonText}>NUEVO VIAJE</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.boton}
                onPress={() => navigation.goBack()}>
                <Text style={styles.botonText}> VOLVER</Text>
            </TouchableOpacity>

            <View style={styles.coordsContainer}>
                {coords ? (
                    <>
                        <Text style={styles.coordsTitle}>UBICACION AGREGADA:</Text>
                        <Text style={styles.coordText}>
                            🔴 Latitud: {coords.latitude.toFixed(6)}
                        </Text>
                        <Text style={styles.coordText}>
                            🔵 Longitud: {coords.longitude.toFixed(6)}
                        </Text>
                        <Text style={styles.coordText}>
                            🎯 Precisión: {coords.accuracy?.toFixed(2)} metros
                        </Text>
                        
                    </>
                ) : (
                    <Text style={styles.noLocationText}>
                        {obteniendo ? '⏳ AGREGANDO NUEVO VIAJE' : '❓'}
                    </Text>
                )}
            </View>



        </View>
    )
}
const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        justifyContent: 'flex-start',
        alignContent: 'center',
        backgroundColor: 'yellow',
    },
    titulo: {
        textAlign: 'center',
        padding: 20,
        backgroundColor: '#677c08',
        color: 'white',
        padding: 15,
        margin: 5,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 20,
        fontWeight: 'bold',
    },
    boton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        margin: 20,
        marginVertical: 5,
    },
    botonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    coordsContainer: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 12,
        marginBottom: 30,
        marginTop: 20,
        minWidth: '90%',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    coordsTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#495057',
    },
    coordText: {
        fontSize: 15,
        marginBottom: 3,
        color: '#6c757d',
        fontFamily: 'monospace',
    },
});
