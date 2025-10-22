import { Text, View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
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

    const guardar = async () => {
        const uid = auth.currentUser?.uid;
        if (!uid) {
            showModal("No hay usuario autenticado");
            return;
        }

        if (!nombre || !edad) {
            showModal("Los campos nombre y edad son obligatorios");
            return;
        }
        if (!validarEdad(edad)) {
            showModal("Por favor, ingresa una edad válida");
            return;
        }

        setGuardando(true);
        try {
            await actualizarPerfil(uid, { nombre, edad, descripcion });
            showModal("✅ Perfil guardado con éxito");
        } catch (error) {
            showModal("❌ Error al guardar el perfil");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <View style={styles.screen}>
            <View style={styles.topBlob}/>
            <View style={styles.bottomBlob}/>

            <View style={styles.container}>
                <Text style={styles.title}>✍️ Editar Perfil</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nuevo nombre"
                    value={nombre}
                    onChangeText={setNombre}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Edad"
                    keyboardType="numeric"
                    value={edad}
                    onChangeText={setEdad}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Nueva descripción"
                    value={descripcion}
                    onChangeText={setDescripcion}
                />

                <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={guardar}>
                    <Text style={styles.buttonText}>
                        {guardando ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>VOLVER</Text>
                </TouchableOpacity>
            </View>

            {/* MODAL */}
            <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalText}>{modalMessage}</Text>
                    <TouchableOpacity style={styles.modalButton} onPress={toggleModal}>
                        <Text style={styles.modalButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#FFF6E6',
        alignItems: 'center',
    },
    topBlob: {
        position: 'absolute',
        top: -70,
        left: -60,
        width: 200,
        height: 200,
        backgroundColor: '#FFD7A8',
        borderRadius: 120,
        opacity: 0.95,
    },
    bottomBlob: {
        position: 'absolute',
        bottom: -80,
        right: -80,
        width: 260,
        height: 260,
        backgroundColor: '#B9F5E0',
        borderRadius: 140,
        opacity: 0.95,
    },
    container: {
        width: '90%',
        marginTop: 80,
        padding: 22,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.85)',
        elevation: 6,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#3b2e5a',
        textAlign: 'center',
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#ffffff',
        borderRadius: 14,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 14,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 40,
        alignItems: 'center',
        marginVertical: 8,
    },
    buttonPrimary: {
        backgroundColor: '#6C5CE7', // MORADO
    },
    buttonSecondary: {
        backgroundColor: '#FF7675', // ROSA
    },
    buttonText: {
        color: 'white',
        fontWeight: '800',
        fontSize: 16,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 25,
        borderRadius: 16,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 18,
    },
    modalButton: {
        backgroundColor: '#6C5CE7',
        paddingVertical: 10,
        paddingHorizontal: 26,
        borderRadius: 30,
    },
    modalButtonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 15,
    }
});
