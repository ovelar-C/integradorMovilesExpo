import { useState } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import * as SecureStore from 'expo-secure-store';
import { setDoc, doc } from 'firebase/firestore';
import {validarEdad, verificarEmail} from '../validaciones y Permisos/validar'

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [edad, setEdad] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const toggleModal = () => setModalVisible(!isModalVisible);

    const showModal = (message) => {
        setModalMessage(message);
        toggleModal();
    };

    const guardarDatosUsuario = async (uid, nombre, email, edad, descripcion) => {
        try {
            await SecureStore.setItemAsync('uid', uid);
            await SecureStore.setItemAsync(`nombre_${uid}`, nombre);
            await SecureStore.setItemAsync(`email_${uid}`, email);
            await SecureStore.setItemAsync(`edad_${uid}`, edad);
            await SecureStore.setItemAsync(`descripcion_${uid}`, descripcion);

            console.log('DATOS GUARDADOS en SECURESTORE:', { uid, nombre, email, edad, descripcion });
        } catch (error) {
            console.log('error al guardar datos en SecureStore:', error);
        }
    };

    const signIn = async () => {
        if (!email || !password) {
            showModal("Por favor, completa los campos Email y Contraseña");
            return;
        }
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await SecureStore.setItemAsync('uid', user.uid);
            showModal("Sesión iniciada correctamente");
        } catch (error) {
            showModal("ERROR AL INICIAR SESÍON: " + error.message);
        }
    };

    const signUp = async () => {
        if (!email || !password || !nombre || !edad || !descripcion) {
            showModal("Por favor complete todos los campos!");
            return;
        }

        if (!verificarEmail(email)) {
            showModal("Por favor ingrese un correo valido!");
            return;
        }
        if (!validarEdad(edad)) {
            showModal("Por favor ingrese una edad válida!");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            try {
                await setDoc(doc(db, 'usuarios', user.uid), {
                    nombre: nombre,
                    email: email,
                    edad: edad,
                    descripcion: descripcion,
                });
            } catch (error) {
                console.log("error al usar setDoc", error);
            }

            await guardarDatosUsuario(user.uid, nombre, email, edad, descripcion);
            showModal("Cuenta creada correctamente!");
        } catch (error) {
            showModal("ERROR AL CREAR LA CUENTA: " + error.message);
        }
    };

    return (
        <View style={styles.screen}>
            {/* decorative blobs */}
            <View style={styles.blobTop} />
            <View style={styles.blobBottom} />

            <View style={styles.card}>
                <Text style={styles.header}>¡Hola! 👋</Text>
                <Text style={styles.subheader}>Crea tu cuenta o inicia sesión</Text>

                <Text style={styles.label}>NOMBRE</Text>
                <TextInput value={nombre} onChangeText={setNombre} style={styles.input} />

                <Text style={styles.label}>EMAIL</Text>
                <TextInput value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />

                <Text style={styles.label}>EDAD</Text>
                <TextInput value={edad} onChangeText={setEdad} style={styles.input} keyboardType="numeric" />

                <Text style={styles.label}>CONTRASEÑA</Text>
                <TextInput value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />

                <Text style={styles.label}>DESCRIPCIÓN</Text>
                <TextInput value={descripcion} onChangeText={setDescripcion} style={styles.input} />

                <TouchableOpacity style={[styles.bubble, styles.primaryBubble]} onPress={signUp}>
                    <Text style={styles.bubbleText}>CREAR CUENTA</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.bubble, styles.secondaryBubble]} onPress={signIn}>
                    <Text style={styles.bubbleText}>INICIAR SESIÓN</Text>
                </TouchableOpacity>
            </View>

            <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalText}>{modalMessage}</Text>
                    <TouchableOpacity onPress={toggleModal} style={styles.modalClose}>
                        <Text style={styles.modalCloseText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#FFEEF6',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 18,
    },
    blobTop: {
        position: 'absolute',
        top: -80,
        left: -60,
        width: 240,
        height: 240,
        backgroundColor: '#FFD6EC',
        borderRadius: 140,
        transform: [{ rotate: '15deg' }],
        opacity: 0.9,
    },
    blobBottom: {
        position: 'absolute',
        bottom: -90,
        right: -70,
        width: 260,
        height: 260,
        backgroundColor: '#D6FFF2',
        borderRadius: 140,
        transform: [{ rotate: '-25deg' }],
        opacity: 0.95,
    },
    card: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 24,
        padding: 18,
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
    },
    header: {
        fontSize: 26,
        fontWeight: '800',
        color: '#3b2e5a',
        marginBottom: 4,
    },
    subheader: {
        color: '#6b5b7a',
        marginBottom: 12,
    },
    label: {
        marginTop: 10,
        color: '#6b6b6b',
        fontWeight: '700',
        fontSize: 12,
        letterSpacing: 0.6,
    },
    input: {
        backgroundColor: '#FFF7FF',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginTop: 6,
        borderWidth: 1,
        borderColor: '#F0E6F6',
    },
    bubble: {
        marginTop: 14,
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 22,
        borderRadius: 30,
        alignSelf: 'center',
        width: '100%',
        // asymmetric feel:
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 12,
        elevation: 4,
    },
    primaryBubble: {
        backgroundColor: '#6C5CE7',
        borderTopLeftRadius: 60,
        borderBottomRightRadius: 10,
    },
    secondaryBubble: {
        backgroundColor: '#00B894',
        borderTopRightRadius: 60,
        borderBottomLeftRadius: 10,
    },
    bubbleText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 16,
        letterSpacing: 0.6,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        borderRadius: 16,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 12,
    },
    modalClose: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#6C5CE7',
        borderRadius: 14,
    },
    modalCloseText: {
        color: 'white',
        fontWeight: '700',
    },
});
