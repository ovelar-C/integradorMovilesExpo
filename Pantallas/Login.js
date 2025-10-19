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
    //guarda los datos en el SecureStore
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
    //iniciar sesión con Email y Password
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
    //crear cuenta
    const signUp = async () => {
        console.log("DENTRO DE SIGN UP")
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
            console.log("dentro del try de SIGN UP");
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
                console.log("error al usar setDoc".error);
            }

            console.log("antes de guardarDatosUsuarios");
            await guardarDatosUsuario(user.uid, nombre, email, edad, descripcion);
            console.log('DATOS ANTES DE guardar en SecureStore:', { uid, nombre, email, edad, descripcion });

            showModal("Cuenta creada correctamente!");
        } catch (error) {
            showModal("ERROR AL CREAR LA CUENTA: " + error.message);
        }
        console.log("ultima DE SIGN UP")

    };

    return (
        <View style={styles.contenedor}>
            <View style={styles.contenedorTitulo}>
                <Text style={styles.titulo}>
                    LOGIN
                </Text>
            </View>

            <View style={styles.textInput}>
                <Text style={styles.textos}>NOMBRE:</Text>
                <TextInput
                    value={nombre}
                    onChangeText={setNombre}
                    style={styles.input}
                />
                <Text style={styles.textos}>EMAIL:</Text>

                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />
                <Text style={styles.textos}>EDAD:</Text>

                <TextInput
                    value={edad}
                    onChangeText={setEdad}
                    style={styles.input}
                    keyboardType="numeric"
                />
                <Text style={styles.textos}>CONTRASEÑA:</Text>

                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    secureTextEntry
                />
                <Text style={styles.textos}>DESCRIPCION:</Text>

                <TextInput
                    value={descripcion}
                    onChangeText={setDescripcion}
                    style={styles.input}
                />
            </View>

            <TouchableOpacity style={styles.boton}
                onPress={signUp}>
                <Text style={styles.botonText}> CREAR CUENTA</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.boton}
                onPress={signIn}>
                <Text style={styles.botonText}> INICIAR SESIÓN</Text>
            </TouchableOpacity>

            {/* aca se personaliza los modales para las alertas */}
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
        justifyContent: 'center',
        backgroundColor: '#f0d332ff',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    contenedorTitulo: {
        marginBottom: 20,
        alignItems: 'center',
        backgroundColor: '#f5f0a9ff',
        borderRadius: 39
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        margin: 10

    },
    textos: {
        fontWeight: '600',
        color: '#34495e',
        alignSelf: 'flex-start',
        marginLeft: 5,
        marginTop: 10,
    },
    textInput: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    input: {
        backgroundColor: '#ecf0f1',
        borderRadius: 10,
        width: '100%',
        marginTop: 6,
        marginBottom: 12,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#d0d0d0',
    },
    boton: {
        backgroundColor: '#3498db',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#3498db',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 3,
    },
    botonText: {
        color: 'white',
        fontSize: 17,
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
        margin:5
    },
});
