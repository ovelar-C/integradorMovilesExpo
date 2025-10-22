import * as Location from 'expo-location';
import { useState, useRef, useEffect } from "react";
import { guardarUbicacion } from '../validaciones y Permisos/guardar';
import { solicitarPermiso, solicitarPermisoCamara } from '../validaciones y Permisos/permisos';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { CameraView } from 'expo-camera';
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
    const showModal = (message) => { setModalMessage(message); toggleModal(); };

    useEffect(() => { cargarUbicacion(); }, []);

    const cargarUbicacion = async () => {
        try {
            const coords = await SecureStore.getItemAsync('ubicacion');
            if (coords) setCoords(JSON.parse(coords));
        } catch (error) {
            console.log("error al obtener ubicacion")
        }
    }

    const obtenerUbicacion = async () => {
        const permisoCamara = await solicitarPermisoCamara();
        const permisoUbicacion = await solicitarPermiso();

        if (!permisoUbicacion || !permisoCamara) {
            showModal("Permiso de cámara o ubicación denegado");
            return;
        }

        try {
            const ubicacion = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            setCoords(ubicacion.coords);
            guardarUbicacion(ubicacion.coords);
            setShowCamera(true);
        } catch (error) {
            showModal('ERROR: No se pudo obtener la ubicación');
        }
    };

    const tomarYGuardarFoto = async () => {
        if (cameraRef.current) {
            try {
                const fotoTomada = await cameraRef.current.takePictureAsync();
                setFoto(fotoTomada.uri);
                showModal('Foto tomada con éxito 📸');
                setShowCamera(false);
            } catch (error) {
                showModal('Error al tomar la foto');
            }
        }
    };

    if (showCamera) {
        return (
            <View style={styles.screen}>
                <CameraView style={styles.camera} ref={cameraRef} />
                <View style={styles.controls}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowCamera(false)}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.captureButton} onPress={tomarYGuardarFoto}>
                        <View style={styles.captureCircle} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (foto) {
        return (
            <View style={styles.screen}>
                <Text style={styles.title}>Vista previa de la entrega</Text>
                <Image source={{ uri: foto }} style={styles.previewImage} />

                <TouchableOpacity
                    style={[styles.bubble, styles.bubblePrimary, { marginTop: 20 }]}
                    onPress={() => { showModal('Entrega registrada ✅'); setFoto(null); }}
                >
                    <Text style={styles.bubbleText}>Guardar Entrega</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.bubble, styles.bubbleAccent]}
                    onPress={() => { setFoto(null); setShowCamera(true); }}
                >
                    <Text style={styles.bubbleText}>Repetir Foto</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            {/* decorative blobs */}
            <View style={styles.topBlob} />
            <View style={styles.bottomBlob} />

            <View style={styles.container}>
                <Text style={styles.title}>🧺 Nueva Entrega</Text>

                {coords ? (
                    <MapView
                        style={styles.map}
                        region={{
                            latitude: coords.latitude,
                            longitude: coords.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                        showsUserLocation
                        followsUserLocation
                    >
                        <Marker
                            coordinate={{
                                latitude: coords.latitude,
                                longitude: coords.longitude,
                            }}
                            title="Última ubicación"
                        />
                    </MapView>
                ) : (
                    <Text style={styles.placeholder}>SIN REGISTRO DE UBICACIÓN</Text>
                )}

                <TouchableOpacity style={[styles.bubble, styles.bubblePrimary]} onPress={obtenerUbicacion}>
                    <Text style={styles.bubbleText}>CAPTURAR ENTREGA</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.bubble, styles.bubbleDanger]} onPress={() => navigation.goBack()}>
                    <Text style={styles.bubbleText}>VOLVER</Text>
                </TouchableOpacity>
            </View>

            <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalText}>{modalMessage}</Text>
                    <TouchableOpacity onPress={toggleModal}><Text style={styles.modalText}>Cerrar</Text></TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFF6E6', alignItems: 'center' },
    topBlob: { position: 'absolute', top: -70, left: -60, width: 200, height: 200, backgroundColor: '#FFD7A8', borderRadius: 120, transform: [{ rotate: '10deg' }], opacity: 0.95 },
    bottomBlob: { position: 'absolute', bottom: -80, right: -80, width: 260, height: 260, backgroundColor: '#B9F5E0', borderRadius: 140, transform: [{ rotate: '-20deg' }], opacity: 0.95 },
    container: { width: '90%', marginTop: 40, alignItems: 'center', padding: 18, borderRadius: 22,
         backgroundColor: 'rgba(255,255,255,0.85)',
          elevation: 6, shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12 },
    title: { fontSize: 22, fontWeight: '800', color: '#3b2e5a', marginBottom: 14, textAlign: 'center',marginTop:22 },
    map: { width: '100%', height: 250, borderRadius: 15, marginVertical: 10 },
    placeholder: { fontSize: 16, color: '#555', fontStyle: 'italic', marginVertical: 20, textAlign: 'center' },
    camera: { flex: 1, width: '100%' },
    controls: { position: 'absolute', bottom: 50, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 30 },
    closeButton: { backgroundColor: '#FF6B6B', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
    closeText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    captureButton: { backgroundColor: 'rgba(255,255,255,0.3)', width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center' },
    captureCircle: { backgroundColor: 'white', width: 50, height: 50, borderRadius: 25 },
    previewImage: { width: '90%', height: '50%', borderRadius: 15, marginVertical: 20 },
    bubble: { width: '100%', paddingVertical: 16, alignItems: 'center', marginVertical: 10, borderRadius: 40, shadowColor: '#000', shadowOpacity: 0.12, shadowOffset: { width: 0, height: 8 }, shadowRadius: 14, elevation: 5 },
    bubblePrimary: { backgroundColor: '#6C5CE7', borderTopLeftRadius: 80, borderBottomRightRadius: 14 },
    bubbleAccent: { backgroundColor: '#6C5CE7', borderTopRightRadius: 80, borderBottomLeftRadius: 14 },
    bubbleDanger: { backgroundColor: '#FF6B6B', borderTopLeftRadius: 14, borderBottomRightRadius: 80 },
    bubbleText: { color: '#fff', fontWeight: '800', fontSize: 16, letterSpacing: 0.7 },
    modalContent: { backgroundColor: 'white', padding: 25, borderRadius: 15, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
    modalText: { fontSize: 16, color: '#0b9ff5ff', textAlign: 'center', fontWeight: 'bold', margin: 5 },
});