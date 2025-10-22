import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { obtenerPerfil } from "../servicios/servicioFirebase";
import { auth } from '../firebase';
import * as SecureStore from 'expo-secure-store';

export default function TuPerfil({ navigation }) {
    const [datos, setDatos] = useState(null);
    const [coordenadas, setCoordenadas] = useState(null);
    const [suscripcion, setSuscripcion] = useState(null);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            cargarPerfil(user.uid);
        } else {
            console.log("No hay usuario autenticado");
        }
        cargarUbicacion();
    }, []);

    const cargarUbicacion = async () => {
        try {
            const coords = await SecureStore.getItemAsync('ubicacion');
            setCoordenadas(JSON.parse(coords));
        } catch (error) {
            console.log("error al obtener ubicacion");
        }
    };

    const cargarPerfil = async (uid) => {
        try {
            const data = await obtenerPerfil(uid);
            if (data) {
                setDatos(data);
            } else {
                console.log("no se puedo encontrar el perfil");
            }
        } catch (error) {
            console.log("error al obtener el perfil", error);
            obtenerDatosSecure(uid);
        }
    };

    const obtenerDatosSecure = async (uid) => {
        const nombreUid = await SecureStore.getItemAsync(`nombre_${uid}`);
        const edadUid = await SecureStore.getItemAsync(`edad_${uid}`);
        const descripcionUid = await SecureStore.getItemAsync(`descripcion_${uid}`);

        if (nombreUid && edadUid && descripcionUid) {
            setDatos({ nombre: nombreUid, edad: edadUid, descripcion: descripcionUid });
        } else {
            console.log("error al obtner los datos de securestore");
        }
    };

    const limpiarUbicacion = () => {
        setCoordenadas(null);
        if (suscripcion) {
            suscripcion.remove();
            setSuscripcion(null);
        }
        SecureStore.deleteItemAsync('ubicacion');
    };

    return (
        <View style={styles.screen}>
            <View style={styles.backgroundBlob} />
            <View style={styles.headerBlob} />

            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.name}>{datos?.nombre ?? "Usuario"}</Text>
                    <Text style={styles.desc}>{datos?.descripcion ?? "Sin descripción"}</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>EMAIL</Text>
                        <Text style={styles.value}>{auth.currentUser ? auth.currentUser.email : "No autenticado"}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>EDAD</Text>
                        <Text style={styles.value}>{datos?.edad}</Text>
                    </View>

                    <View style={styles.coords}>
                        {coordenadas ? (
                            <>
                                <Text style={styles.coordText}>Latitud: {coordenadas.latitude}</Text>
                                <Text style={styles.coordText}>Longitud: {coordenadas.longitude}</Text>
                            </>
                        ) : (
                            <Text style={styles.coordText}>No hay coordenadas almacenadas</Text>
                        )}
                    </View>
                </View>

                <TouchableOpacity style={[styles.actionBubble, styles.editBubble]} onPress={() => navigation.navigate('EditarPerfil')}>
                    <Text style={styles.actionText}>✏️ EDITAR PERFIL</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionBubble, styles.deleteBubble]} onPress={limpiarUbicacion}>
                    <Text style={styles.actionText}>🗑 BORRAR UBICACIÓN</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionBubble, styles.backBubble]} onPress={() => navigation.navigate('Inicio')}>
                    <Text style={styles.actionText}>⬅️ VOLVER</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#FFF9F2',
        alignItems: 'center',
    },
    backgroundBlob: {
        position: 'absolute',
        top: -100,
        left: -90,
        width: 300,
        height: 300,
        backgroundColor: '#FFE4F2',
        borderRadius: 200,
        transform: [{ rotate: '-10deg' }],
    },
    headerBlob: {
        position: 'absolute',
        top: 40,
        right: -60,
        width: 220,
        height: 220,
        backgroundColor: '#E0FFF4',
        borderRadius: 180,
        transform: [{ rotate: '30deg' }],
    },
    container: {
        width: '92%',
        marginTop: 80,
        alignItems: 'center',
    },
    card: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 22,
        padding: 18,
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 16,
    },
    name: {
        fontSize: 20,
        fontWeight: '800',
        color: '#3b2e5a',
    },
    desc: {
        color: '#6b5b7a',
        marginTop: 6,
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F4',
    },
    label: {
        color: '#8b7f9b',
        fontWeight: '700',
    },
    value: {
        color: '#2b2b2b',
        fontWeight: '600',
    },
    coords: {
        marginTop: 12,
        backgroundColor: '#FBFBFE',
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#F0F0F4',
    },
    coordText: {
        color: '#434343',
    },
    actionBubble: {
        width: '100%',
        marginTop: 12,
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 40,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 14,
        elevation: 5,
    },
    editBubble: {
        backgroundColor: '#6C5CE7',
        borderTopLeftRadius: 80,
        borderBottomRightRadius: 14,
    },
    deleteBubble: {
        backgroundColor: '#FF6B6B',
        borderTopRightRadius: 80,
        borderBottomLeftRadius: 14,
    },
    backBubble: {
        backgroundColor: '#00B894',
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 80,
    },
    actionText: {
        color: '#fff',
        fontWeight: '800',
    },
});
