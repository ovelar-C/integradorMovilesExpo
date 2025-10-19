import { Text, View, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useState } from "react";
import { auth } from "../firebase";
import { actualizarPerfil } from "../servicios/servicioFirebase";
import { validarEdad } from "../validaciones y Permisos/validar";
import Modal from "react-native-modal";


export default function EditarPerfil({ navigation }) {
    const [nombre, setNombre] = useState('');
    const [edad, setEdad] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [guardando, setGuardando] = useState(false);

    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const toggleModal = () => setModalVisible(!isModalVisible);

    const showModal = (message) => {
        setModalMessage(message);
        toggleModal();
    };

    //guardamos los datos editados
    const guardar = async () => {
        const uid = auth.currentUser?.uid; // Obtenemos el UID del usuario autenticado
        if (!uid) {
            showModal("error", "no hay usuario autenticado");
            return;
        }

        const datos = { nombre, edad, descripcion };
        if (!nombre && edad) {
            showModal("los campos nombre y edad son obligatorios!");
            return;
        }
        if (!nombre && !edad && !descripcion) {
            showModal("Complete los campos por favor te lo suplico");
            return
        }
        if (!validarEdad(edad)) {
            showModal("Por favor, ingresa una edad válida!");
            return;
        }
        setGuardando(true);

        try {
            await actualizarPerfil(uid, datos);
            showModal("Perfecto", "Perfil guardado!");
            setGuardando(false);
        } catch (error) {
            console.log("error al guardar perfil", error);
            showModal("ERROR", "error al guardar perfil");
            setGuardando(false);

        }
    };

    return (
        <View style={styles.contenedor}>

            <Text style={styles.titulo}>✍️​ EDITAR PERFIL ✍️​</Text>
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
        backgroundColor: 'yellow',
        padding: 20,
    },
    titulo: {
        textAlign: 'center',
        padding: 20,
        backgroundColor: '#e27720ff',
        color: 'white',
        padding: 15,
        margin: 5,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 20,
        fontWeight: 'bold',
        fontSize: 20,
    },
    input: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#dcdcdc',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
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
    botonGuardando: {
        backgroundColor: '#27ae60',
    },
    botonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
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
        margin: 5
    },
});
