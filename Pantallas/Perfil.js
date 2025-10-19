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
            console.log('usuario autenticado');
            cargarPerfil(user.uid)
        } else {
            console.log("No hay usuario autenticado");
        }
        cargarUbicacion();
    }, []);
    //obtener datos de las coordenadas
    const cargarUbicacion = async () => {
        try {
            const coords = await SecureStore.getItemAsync('ubicacion');
            setCoordenadas(JSON.parse(coords));

        } catch (error) {
            console.log("error al obtener ubicacion")
        }
    }
    //cargar los datos del usuario
    const cargarPerfil = async (uid) => {
        console.log("UID en cargarperfil:", uid);
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
    }
    //si firebase no funciona obtenemos lo datos del SecureStore
    const obtenerDatosSecure = async (uid) => {

        console.log("UID en obtenerDatosSecure:", uid);
        const nombreUid = await SecureStore.getItemAsync(`nombre_${uid}`);
        const edadUid = await SecureStore.getItemAsync(`edad_${uid}`);
        const descripcionUid = await SecureStore.getItemAsync(`descripcion_${uid}`);

        console.log("Datos SecureStore - Nombre:", nombreUid, "Edad:", edadUid, "Descripcion:", descripcionUid);

        if (nombreUid && edadUid && descripcionUid) {
            setDatos({ nombre: nombreUid, edad: edadUid, descripcion: descripcionUid });
        } else {
            console.log("error al obtner los datos de securestore");
        }
    }
    //limpiamos las coordenadas del SecureStore
    const limpiarUbicacion = () => {
        setCoordenadas(null);
        if (suscripcion) {
            suscripcion.remove();
            setSuscripcion(null);
        }
        SecureStore.deleteItemAsync('ubicacion');
    };

    return (
        <View style={styles.contenedor}>

            <View style={styles.datos}>
                <Text style={styles.datosTexto}>
                    EMAIL: {auth.currentUser ? auth.currentUser.email : "No autenticado"}
                </Text>
                <Text style={styles.datosTexto}>NOMBRE: {datos?.nombre}</Text>
                <Text style={styles.datosTexto}>EDAD: {datos?.edad}</Text>
                <Text style={styles.datosTexto}>DESCRIPCION: {datos?.descripcion}</Text>

                <View style={styles.datosCoords}>
                    {coordenadas ? (
                        <>
                            <Text style={styles.datosTexto}>Latitud: {coordenadas.latitude}</Text>
                            <Text style={styles.datosTexto}>Longitud: {coordenadas.longitude}</Text>
                        </>
                    ) : (
                        <Text style={styles.datosTexto}>No hay coordenadas almacenadas</Text>
                    )}
                </View>

            </View>

            <TouchableOpacity style={styles.boton}
                onPress={() => navigation.navigate('EditarPerfil')} >
                <Text style={styles.botonText}>EDITAR PERFIL</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.boton}
                onPress={limpiarUbicacion}>
                <Text style={styles.botonText}>BORRAR UBICACIÓN</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.boton}
                onPress={() => navigation.navigate('Inicio')} >
                <Text style={styles.botonText}> VOLVER</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: 'yellow',
        padding: 20,
    },
    datos: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    datosTexto: {
        fontSize: 16,
        color: '#2c3e50',
        fontWeight: '500',
        margin: 10,
        alignContent: 'center',

    },
    datosCoords: {
        marginTop: 15,
        padding: 12,
        backgroundColor: '#eaf0f6',
        borderRadius: 12,
    },
    boton: {
        backgroundColor: '#3498db',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#3498db',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    botonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
