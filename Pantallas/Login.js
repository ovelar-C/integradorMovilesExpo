/*
import { useState } from "react";
import { Alert, Text, View, TextInput, StyleSheet, Button } from "react-native";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import * as SecureStore from 'expo-secure-store';
import { setDoc, doc } from 'firebase/firestore';

import { validarEdad, verificarEmail} from "../validaciones/validar";


export default function Login() {
    //ESTADOS
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [edad, setEdad] = useState('');
    const [descripcion, setDescripcion] = useState('');

    //GUARDAMOS LOS DATOS EN SECURESTORE
    const guardarDatosUsuario = async (uid, nombre, email, edad, descripcion) => {
        await SecureStore.setItemAsync('uid', uid);
        await SecureStore.setItemAsync(`nombre_${uid}`, nombre);
        await SecureStore.setItemAsync(`email_${uid}`, email);
        await SecureStore.setItemAsync(`edad_${uid}`, edad);
        await SecureStore.setItemAsync(`descripcion_${uid}`, descripcion)
    };

    //INICIAR SESIÓN CON EMAIL Y PASSWORD
    const signIn = async () => {
        if (!email || !password) {
            Alert.alert("completa los campos Email y Contraseña");
            return;
        }
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await SecureStore.setItemAsync('uid', user.uid);
            Alert.alert("SESION INICIADA CORRECTAMENTE");
        } catch (error) {
            alert("ERROR AL INICIAR SESION", error.message);

        }
    }

    //CREAR CUENTA/REGISTRARSE
    const signUp = async () => {
        if (!email || !password || !nombre || !edad || !descripcion) {
            Alert.alert("completar todos los campos");
            return;
        }
        if (!verificarEmail(email)) {
            Alert.alert("ingrese un correo valido por favor");
            return;
        }
        if (!validarEdad(edad)) {
            Alert.alert("ingrese una edad valida")
            return;
        }

        try {
            //creamos el usuario con firebase y los datos del usuario
            //lo guardamos en user con su uid
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            //guardamos lo datos en firestore
            //despues guardamos los mismos datos en securestore

            await setDoc(doc(db, 'usuarios', user.uid), {
                nombre: nombre,
                email: email,
                edad: edad,
                descripcion: descripcion,
            });

            await guardarDatosUsuario(user.uid, nombre, email, edad, descripcion);

            Alert.alert("cuenta creada perfectamente");
        } catch (error) {
            alert("error al crear la cuenta" , error.message);
        }
    };

    return (
        <View style={styles.container}>

            <Text style={styles.textoLogin}>
                LA MEJOR PANTALLA DE LOGIN QUE VAS A VER EN TODA TU VIDA :D
            </Text>

            <View style={styles.textInput}>
                <Text>nombre:</Text>
                <TextInput
                    value={nombre}
                    onChangeText={setNombre}
                    style={styles.input}
                />

                <Text>Email:</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />

                <Text>edad:</Text>
                <TextInput
                    value={edad}
                    onChangeText={setEdad}
                    style={styles.input}
                    keyboardType="numeric"
                />

                <Text>contraseña:</Text>
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input} secureTextEntry
                />

                <Text>descripcion:</Text>
                <TextInput
                    value={descripcion}
                    onChangeText={setDescripcion}
                    style={styles.input}
                />
            </View>

            <Button title="Iniciar sesión" onPress={signIn} />
            <Button title="crear cuenta " onPress={signUp} />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    textoLogin: {
        backgroundColor: '#90ebebff',
        textAlign: 'center',
    },
    textInput: {
        backgroundColor: '#a4f0c4ff',
        width: '100%',
        alignItems: 'center',
        padding: 20,
        borderWidth: 3,

    },
    input: {
        backgroundColor: 'white',
        borderRadius: 8,
        width: '90%',
        marginVertical: 10,


    },
});
*/
import { useState } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import * as SecureStore from 'expo-secure-store';
import { setDoc, doc } from 'firebase/firestore';

import { validarEdad, verificarEmail } from "../validaciones y Permisos/validar";

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
            showModal("Error al iniciar sesión: " + error.message);
        }
    };

    const signUp = async () => {
        console.log("DENTRO DE SIGN UP")
        if (!email || !password || !nombre || !edad || !descripcion) {
            showModal("Por favor completa todos los campos");
            return;
        }

        if (!verificarEmail(email)) {
            showModal("Por favor ingresa un correo valido");
            return;
        }

        if (!validarEdad(edad)) {
            showModal("Por favor ingresa una edad valida");
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

            showModal("Cuenta creada correctamente");
        } catch (error) {
            showModal("Error al crear la cuenta: " + error.message);
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
        justifyContent: 'flex-start',
        backgroundColor: 'yellow',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    contenedorTitulo: {
        marginBottom: 10,
        justifyContent:'center',
    },
    titulo: {
        textAlign: 'center',
        padding: 15,
        backgroundColor: '#66bd1fff',
        color: 'white',
        marginVertical: 10,
        borderRadius: 12,
        fontWeight: 'bold',
        fontSize: 16,

    },
    textos:{
        fontWeight: 'bold',
        color:'#58290a'
    },
    textInput: {
        backgroundColor: '#fa9551ff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center'
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 8,
        width: '100%',
        marginVertical: 8,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    boton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 15,
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
    },
    modalText: {
        fontSize: 18,
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
});

