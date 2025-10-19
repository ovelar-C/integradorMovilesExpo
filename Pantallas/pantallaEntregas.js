import * as Location from 'expo-location';
import { useState, useRef, useEffect } from "react";
import { guardarUbicacion } from '../validaciones y Permisos/guardar';
import { solicitarPermiso, solicitarPermisoCamara } from '../validaciones y Permisos/permisos';
import { View, Text, TouchableOpacity, StyleSheet,Image} from 'react-native';
import { CameraView } from 'expo-camera';
import { File, Directory, Paths } from 'expo-file-system';
import MapView, { Marker } from 'react-native-maps';
import Modal from "react-native-modal";

import * as SecureStore from 'expo-secure-store';

export default function Entregas({ navigation }) {
    const [coords, setCoords] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const cameraRef = useRef(null);
    const [foto, setFoto] = useState(null);


    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const toggleModal = () => setModalVisible(!isModalVisible);

    const showModal = (message) => {
        setModalMessage(message);
        toggleModal();
    };

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
        const permisoCamara = await solicitarPermisoCamara();
        const permisoUbicacion = await solicitarPermiso();

        if (!permisoUbicacion || !permisoCamara) {
            console.log("permiso de ubi o camara denegado");
            showModal("permiso de camara y de ubicacion denegado");
            return;
        }
        try {
            const ubicacion = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            setCoords(ubicacion.coords);
            console.log('📍 Ubicación obtenida:', ubicacion.coords.latitude, ubicacion.coords.longitude);
            guardarUbicacion(ubicacion.coords);
            setShowCamera(true);

        } catch (error) {
            console.error('Error al obtener ubicación:', error);
            showModal('ERROR, No se pudo obtener la ubicación');
        }
    };
    // Función principal para tomar y guardar foto
    const tomarYGuardarFoto = async () => {
    console.log("dentro de tomar foto");

    if (cameraRef.current) {
        try {
            const fotoTomada = await cameraRef.current.takePictureAsync();
            console.log('Foto tomada:', fotoTomada.uri);

            setFoto(fotoTomada.uri);

            const directorioFotos = new Directory(Paths.document, 'mis_fotos');
                directorioFotos.create({ idempotent: true });

                const nombreArchivo = `foto_${Date.now()}.jpg`;
                const archivoDestino = new File(directorioFotos, nombreArchivo);
                const fotoTemporal = new File(fotoTomada.uri);

                fotoTemporal.copy(archivoDestino);
                showModal('¡Éxito!', `Foto guardada como: ${nombreArchivo}`);
            setShowCamera(false);

        } catch (error) {
            console.error('Error al tomar la foto:', error);
            showModal('Error al tomar la foto');
        }
    }
};

    if (showCamera) {
        return (
            <View style={styles.contenedorCamara}>
                <CameraView style={styles.camara} ref={cameraRef} />

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

    if (foto) {
    return (
        <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', marginBottom: 10 }}>Vista previa de la entrega</Text>
            <Image
                source={{ uri: foto }}
                style={{ width: '90%', height: '70%', borderRadius: 10 }}
            />

            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <TouchableOpacity
                    style={[styles.boton, { backgroundColor: '#27ae60' }]}
                    onPress={() => {
                        showModal('Entrega registrada con éxito ✅');
                        setFoto(null);
                    }}
                >
                    <Text style={styles.botonText}>Guardar Entrega</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.boton, { backgroundColor: '#e74c3c' }]}
                    onPress={() => {
                        setFoto(null);
                        setShowCamera(true); // Volver a abrir camara
                    }}
                >
                    <Text style={styles.botonText}>Repetir Foto</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
    return (
        <View style={styles.contenedor}>
            <Text style={styles.titulo}>
                🧺​  NUEVA ENTREGA  🧺
            </Text>

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
                        title="Ultima ubicación"
                    />
                </MapView>
            ) : (
                <View style={styles.sinUbicacionContenedor}>
                    <Text style={styles.sinUbicacionTexto}>
                        SIN REGISTRO DE UBICACIÓN
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

    <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>

            <TouchableOpacity style={styles.modalText}
                onPress={toggleModal}
                title="cerrar">
            </TouchableOpacity>
        </View>
    </Modal>

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
        backgroundColor: '#e27720ff',
        color: 'white',
        padding: 15,
        margin: 5,
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 20,
        fontWeight: 'bold',
        fontSize: 20,
    },
    boton: {
        backgroundColor: '#3498db',
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
    map: {
        width: '100%',
        height: 350,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#dee2e6',
        marginTop: 15,
        marginBottom: 10,
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
        backgroundColor: '#e7dec3ff',
        padding: 15,
        borderRadius: 10,
    },
    botonesContenedor: {
        paddingVertical: 10,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 25,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 16,
        color: '#0b9ff5ff',
        textAlign: 'center',
        fontWeight: 'bold',
        margin:5
    },

})