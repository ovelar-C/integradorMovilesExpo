import * as Location from 'expo-location';
import { useState, useRef, useEffect } from "react";
import { guardarUbicacion, solicitarPermiso, solicitarPermisoCamara } from "../validaciones y Permisos/validar";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CameraView } from 'expo-camera';
import { File, Directory, Paths } from 'expo-file-system';
import MapView, { Marker } from 'react-native-maps';
import * as SecureStore from 'expo-secure-store';




//aca debe mostrarse los viajes y un boton para agregar viaje y mostrarlo
export default function Entregas({ navigation }) {
    const [coords, setCoords] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const cameraRef = useRef(null);

    useEffect(() => {
        cargarUbicacion();

    }, []);


    const cargarUbicacion = async () => {
        try {
            const coords = await SecureStore.getItemAsync('ubicacion');
            setCoords(JSON.parse(coords));

        } catch (error) {
            console.log("error al obtener ubicacion")
        }
    }

    const obtenerUbicacion = async () => {
        const permisoUbicacion = await solicitarPermiso();
        const permisoCamara = await solicitarPermisoCamara();

        if (!permisoUbicacion && !permisoCamara) return;

        try {
            const ubicacion = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            setCoords(ubicacion.coords);
            console.log('📍 Ubicación obtenida:', ubicacion.coords.latitude, ubicacion.coords.longitude);
            guardarUbicacion(ubicacion.coords);
            setShowCamera(true);
            tomarYGuardarFoto();

        } catch (error) {
            console.error('Error al obtener ubicación:', error);
            Alert.alert('Error', 'No se pudo obtener la ubicación');
        }
    };
    // Función principal para tomar y guardar foto
    const tomarYGuardarFoto = async () => {
        console.log("dentro de tomar foto");
        if (cameraRef.current) {
            try {
                // 1. Tomar la foto
                const foto = await cameraRef.current.takePictureAsync();
                console.log('Foto tomada:', foto.uri);
                // 2. Crear directorio para guardar fotos
                const directorioFotos = new Directory(Paths.document, 'mis_fotos');
                directorioFotos.create({ idempotent: true });
                // 3. Crear nombre único para la foto
                const nombreArchivo = `foto_${Date.now()}.jpg`;
                // 4. Crear archivo de destino
                const archivoDestino = new File(directorioFotos, nombreArchivo);
                // 5. Copiar foto temporal al archivo permanente
                const fotoTemporal = new File(foto.uri);
                fotoTemporal.copy(archivoDestino);
                // 6. Confirmar éxito
                Alert.alert('¡Éxito!', `Foto guardada como: ${nombreArchivo}`);
                setShowCamera(false);
            } catch (error) {
                console.error('Error:', error);
                Alert.alert('Error', 'No se pudo guardar la foto');
            }
        }
    };

    if (showCamera) {
        return (
            <View style={styles.contenedorCamara}>
                {/* Vista de la cámara */}
                <CameraView style={styles.camara} ref={cameraRef} />

                {/* Controles superpuestos */}
                <View style={styles.controles}>
                    <TouchableOpacity
                        style={styles.botonCerrar}
                        onPress={() => setShowCamera(false)}
                    >
                        <Text style={styles.textoBoton}>✕</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.botonCaptura}
                        onPress={tomarYGuardarFoto}
                    >
                        <View style={styles.circuloCaptura} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.contenedor}>
            <Text style={styles.titulo}>
                ENTREGAS
            </Text>

            {/* Mostrar mapa o mensaje de error */}
            {coords ? (
                <MapView
                    style={styles.map}
                    region={{
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    showsUserLocation={true}
                    followsUserLocation={true}
                >
                    <Marker
                        coordinate={{
                            latitude: coords.latitude,
                            longitude: coords.longitude,
                        }}
                        title="Estás aquí"
                    />
                </MapView>
            ) : (
                <View style={styles.sinUbicacionContenedor}>
                    <Text style={styles.sinUbicacionTexto}>
                        SIN ACCESO A LA UBICACIÓN
                    </Text>
                </View>
            )}

            <View style={styles.botonesContenedor}>
                <TouchableOpacity style={styles.boton}
                    onPress={obtenerUbicacion}>
                    <Text style={styles.botonText}> CAPTURAR ENTREGA</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.boton}
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.botonText}> VOLVER</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

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
        marginBottom: 10,
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
        marginTop: 10,
    },
    botonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    map: {
        width: '100%',
        height: 350,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#dee2e6',
        marginTop: 15,
        marginBottom: 10
    },

    contenedorCamara: {
        flex: 1,
    },
    camara: {
        flex: 1,
    },
    controles: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    botonCerrar: {
        backgroundColor: 'rgba(255, 99, 99, 1)',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botonCaptura: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circuloCaptura: {
        backgroundColor: 'white',
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    sinUbicacionContenedor: {
        paddingHorizontal: 20,
        marginTop: 30,
    },
    sinUbicacionTexto: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        backgroundColor: '#ffecb3',
        padding: 15,
        borderRadius: 10,
    },
    botonesContenedor: {
        paddingVertical: 10,
    }

})