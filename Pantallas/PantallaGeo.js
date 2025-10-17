import { Text, View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState, useEffect } from "react";
import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';



//cuando se presiona el calcular ubicacion debe mostrarse la latitud y longitud
export default function GeoPantalla({ navigation }) {

    const [coords, setCoords] = useState(null);
    const [obteniendo, setObteniendo] = useState(false);
    const [siguiendo, setSiguiendo] = useState(false);
    const [suscripcion, setSuscripcion] = useState(null);

    const guardarUbicacion = async (coords)=>{
        try {
            const jsonCoordenadas = JSON.stringify(coords);
            await SecureStore.setItemAsync('ubicacion', jsonCoordenadas);

        } catch (error) {
            console.log("error al guardar las coordenadas")
        }
    }

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


    const toggleSeguimiento = async () => {
        if (siguiendo) {
            // DETENER seguimiento
            if (suscripcion) {
                suscripcion.remove();
                setSuscripcion(null);
            }
            setSiguiendo(false);
            Alert.alert('✅ Seguimiento detenido');
        } else {
            // INICIAR seguimiento
            const permiso = await solicitarPermiso();
            if (!permiso) return;


            try {
                const sub = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        timeInterval: 3000,      // Cada 3 segundos
                        distanceInterval: 5,     // Cada 5 metros
                    },
                    (ubicacion) => {
                        setCoords(ubicacion.coords);
                        console.log('🎯 Ubicación actualizada:', ubicacion.coords.latitude, ubicacion.coords.longitude);
                    }
                );


                setSuscripcion(sub);
                setSiguiendo(true);
                Alert.alert('🎯 Seguimiento iniciado', 'La ubicación se actualizará automáticamente');


            } catch (error) {
                console.error('Error en seguimiento:', error);
                Alert.alert('Error', 'No se pudo iniciar el seguimiento');
            }
        }
    };
    const limpiarUbicacion = () => {
        setCoords(null);
        if (suscripcion) {
            suscripcion.remove();
            setSuscripcion(null);
        }
        setSiguiendo(false);
    };



    return (

        <View style={styles.contenedor}>

            <View style={styles.contenedorTitulo}>
                <Text style={styles.titulo}>
                    PANTALLA DE UBICACIÓN
                </Text>
            </View>

            <View style={styles.coordsContainer}>
                {coords ? (
                    <>
                        <Text style={styles.coordsTitle}>📍 Tu ubicación:</Text>
                        <Text style={styles.coordText}>
                            🔴 Latitud: {coords.latitude.toFixed(6)}
                        </Text>
                        <Text style={styles.coordText}>
                            🔵 Longitud: {coords.longitude.toFixed(6)}
                        </Text>
                        <Text style={styles.coordText}>
                            🎯 Precisión: {coords.accuracy?.toFixed(2)} metros
                        </Text>
                        {siguiendo && (
                            <Text style={styles.statusText}>🔄 Actualizando en tiempo real...</Text>
                        )}
                    </>
                ) : (
                    <Text style={styles.noLocationText}>
                        {obteniendo ? '⏳ Obteniendo ubicación...' : '❓ Sin ubicación'}
                    </Text>
                )}
            </View>


            {/* Botones de acción */}
            <View>
                <TouchableOpacity
                    style={styles.boton}
                    onPress={obtenerUbicacion}
                    disabled={obteniendo}
                >
                    <Text style={styles.buttonText}>
                        {obteniendo ? '⏳ Obteniendo...' : '📍 Obtener Ubicación'}
                    </Text>
                </TouchableOpacity>


                <TouchableOpacity
                    style={[styles.boton, siguiendo ? styles.stopButton : styles.startButton]}
                    onPress={toggleSeguimiento}
                >
                    <Text style={styles.buttonText}>
                        {siguiendo ? '⏹️ Detener Seguimiento' : '🎯 Seguir Ubicación'}
                    </Text>
                </TouchableOpacity>


                <TouchableOpacity
                    style={styles.boton}
                    onPress={limpiarUbicacion}
                >
                    <Text style={styles.buttonText}>🗑️ Limpiar coordenadas</Text>
                </TouchableOpacity>
            </View>


            {/* Instrucciones */}

            <View style={styles.contenedorBotones}>
                <TouchableOpacity style={styles.otrosBotones}
                    onPress={() => navigation.navigate('Mapa')}>
                    <Text style={styles.botonText}>MAPA</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.otrosBotones}
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.botonText}> VOLVER</Text>
                </TouchableOpacity>
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
    contenedorTitulo: {
        backgroundColor: '#60ad93ff',
        margin: 5,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 20,

    },
    titulo: {
        textAlign: 'center',
        padding: 20,
        color: 'white',
        padding: 15,
        fontWeight: 'bold',
        fontSize: 20,
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
    alien: {
        width: 5.0,
        height: 20,
        marginTop: 30,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    coordsContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        marginBottom: 30,
        minWidth: '90%',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    coordsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#495057',
    },
    coordText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#6c757d',
        fontFamily: 'monospace',
    },
    statusText: {
        fontSize: 14,
        color: '#28a745',
        fontWeight: '500',
        marginTop: 10,
    },
    noLocationText: {
        fontSize: 16,
        color: '#6c757d',
        fontStyle: 'italic',
        textAlign: 'center',
    },
    buttonsContainer: {
        width: '90%',
        gap: 12,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    startButton: {
        backgroundColor: '#28a745',
    },
    stopButton: {
        backgroundColor: '#dc3545',
    },
    clearButton: {
        backgroundColor: '#6c757d',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    contenedorBotones: {
        flex: 1,
        backgroundColor: '#f7d43bff',
        padding: 20,
        marginTop: 40,
        justifyContent: 'flex-start',

    },
    otrosBotones: {
        backgroundColor: '#f5883fff',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        margin: 20,
        marginVertical: 5,
    }
});

