import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { obtenerPerfil } from "../servicios/servicioFirebase";
import { auth } from '../firebase';
import * as SecureStore from 'expo-secure-store';



export default function TuPerfil({ navigation }) {
    const [datos, setDatos] = useState(null);
    const [coordenadas, setCoordenadas] = useState(null);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            console.log('usuario autenticado');
            cargarPerfil(user.uid)
        } else {
            console.log("No hay usuario autenticado");
        }
        cargarUbicacion();
        //listarDatosSecureStore();

    }, []);

    const cargarUbicacion = async () => {
        try {
            const coords = await SecureStore.getItemAsync('ubicacion');
            setCoordenadas(JSON.parse(coords));

        } catch (error) {
            console.log("error al obtener ubicacion")
        }
    }

    //firebase no anda D:
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

    return (
        <View style={styles.contenedor}>
            <View style={styles.datos}>
                <Text style={styles.datosTexto}>
                    Email: {auth.currentUser ? auth.currentUser.email : "No autenticado"}
                </Text>
                <Text style={styles.datosTexto}>Nombre: {datos?.nombre}</Text>
                <Text style={styles.datosTexto}>Descripción: {datos?.descripcion}</Text>
                <Text style={styles.datosTexto}>Edad: {datos?.edad}</Text>


                {coordenadas ? (
                    <>
                        <Text style={styles.datosTexto}>Latitud: {coordenadas.latitude}</Text>
                        <Text style={styles.datosTexto}>Longitud: {coordenadas.longitude}</Text>
                    </>
                ) : (
                    <Text style={styles.datosTexto}>No hay coordenadas almacenadas</Text>
                )}


            </View>

            <TouchableOpacity style={styles.boton}
                onPress={() => navigation.navigate('EditarPerfil')} >
                <Text style={styles.botonText}>EDITAR PERFIL</Text>
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
        justifyContent: 'flex-start',
        alignContent: 'center',
        backgroundColor: 'yellow',
    },
    datos: {
        backgroundColor: '#9e69e2ff',
        textAlign: 'center',
        alignContent: 'center',
        margin: 20,
        marginTop: 20,
        marginBottom: 10,
        borderRadius: 20,

    },
    datosTexto: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
        margin: 10,

    },

    boton: {
        backgroundColor: '#007AFF',
        padding: 2,
        borderRadius: 20,
        alignItems: 'center',
        margin: 20,
        marginVertical: 5,
    },
    botonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
    },


});