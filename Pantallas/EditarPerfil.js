import { Text, View, TextInput, Button, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useState } from "react";
import { auth } from "../firebase";
import { actualizarPerfil } from "../servicios/servicioFirebase";
import { validarEdad } from "../validaciones y Permisos/validar";

export default function EditarPerfil({ navigation }) {
    const [nombre, setNombre] = useState('');
    const [edad, setEdad] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [guardando, setGuardando] = useState(false);

    //arreglar
    const guardar = async () => {
        const uid = auth.currentUser?.uid; // Obtenemos el UID del usuario autenticado
        if (!uid) {
            Alert.alert("error", "no hay usuario autenticado");
            return;
        }

        const datos = { nombre, edad, descripcion };
        if(!nombre && edad){
            Alert.alert("los campos nombre y edad son obligatorios");
            return;
        }
        if (!nombre && !edad && !descripcion) {
            Alert.alert("completa los campos por favor te lo suplico");
            return
        }
        if (!validarEdad(edad)) {
            Alert.alert("Por favor, ingresa una edad válida.");
            return;
        }
        setGuardando(true);

        try {
            await actualizarPerfil(uid, datos);
            Alert.alert("perfecto", "perfil guardado");
            setGuardando(false);
        } catch (error) {
            console.log("error al guardar perfil", error);
            Alert.alert("error", "error al guardar perfil");
            setGuardando(false);

        }
    };


    return (
        <View style={styles.contenedor}>
            <Text style={styles.titulo}>EDITAR PERFIL</Text>
            <TextInput
                style={styles.input}
                placeholder="Nuevo nombre"
                value={nombre}
                onChangeText={setNombre} />

            <TextInput
                style={styles.input}
                placeholder="Edad"
                value={edad}
                onChangeText={setEdad}
                keyboardType="numeric" />

            <TextInput
                style={styles.input}
                placeholder="Nueva descripcion"
                value={descripcion}
                onChangeText={setDescripcion} 
            />

            <TouchableOpacity style={[styles.boton, guardando ? styles.botonGuardando : styles.boton]}
                onPress={() => guardar()} >
                <Text style={styles.botonText}>
                    {guardando ? 'GUARDANDO CAMBIOS' : 'GUARDAR CAMBIOS'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.boton}
                onPress={() => navigation.goBack()}>
                <Text style={styles.botonText}> VOLVER</Text>
            </TouchableOpacity>

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
    input: {
        padding: 20,
        margin: 10,
        backgroundColor: 'white',
    },
    botonGuardando:{
        backgroundColor: 'green',
    }
});
