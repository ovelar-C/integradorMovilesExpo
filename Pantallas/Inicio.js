import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { auth } from '../firebase';
import * as SecureStore from 'expo-secure-store';

export default function Inicio({ navigation }) {
    const cerrarSesion = async () => {
        try {
            await auth.signOut();
            await SecureStore.deleteItemAsync('ubicacion');
            console.log("Sesión cerrada y ubicación eliminada");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <View style={styles.screen}>
            {/* decorative blobs */}
            <View style={styles.topBlob} />
            <View style={styles.bottomBlob} />

            <View style={styles.container}>
                <Text style={styles.title}>🏡 Bienvenido</Text>

                {/* Burbuja orgánica - Mi Perfil */}
                <TouchableOpacity
                    style={[styles.bubble, styles.bubblePrimary]}
                    onPress={() => navigation.navigate('TuPerfil')}
                >
                    <Text style={styles.bubbleText}>MI PERFIL</Text>
                </TouchableOpacity>

                {/* Burbuja orgánica - Delivery */}
                <TouchableOpacity
                    style={[styles.bubble, styles.bubbleAccent]}
                    onPress={() => navigation.navigate('Delivery')}
                >
                    <Text style={styles.bubbleText}>DELIVERY</Text>
                </TouchableOpacity>

                {/* Burbuja orgánica - Cerrar Sesión */}
                <TouchableOpacity
                    style={[styles.bubble, styles.bubbleDanger]}
                    onPress={cerrarSesion}
                >
                    <Text style={styles.bubbleText}>CERRAR SESIÓN</Text>
                </TouchableOpacity>
            </View>
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
        transform: [{ rotate: '10deg' }],
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
        transform: [{ rotate: '-20deg' }],
        opacity: 0.95,
    },
    container: {
        width: '90%',
        marginTop: 80,
        alignItems: 'center',
        padding: 18,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.8)',
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#3b2e5a',
        marginBottom: 14,
    },
    bubble: {
        width: '100%',
        paddingVertical: 16,
        alignItems: 'center',
        marginVertical: 10,
        borderRadius: 40,
        // make each bubble look organic/asymmetric:
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 14,
        elevation: 5,
    },
    bubblePrimary: {
        backgroundColor: '#ff7675',
        borderTopLeftRadius: 80,
        borderBottomRightRadius: 14,
    },
    bubbleAccent: {
        backgroundColor: '#6C5CE7',
        borderTopRightRadius: 80,
        borderBottomLeftRadius: 14,
    },
    bubbleDanger: {
        backgroundColor: '#FF6B6B',
        borderTopLeftRadius: 14,
        borderBottomRightRadius: 80,
    },
    bubbleText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 16,
        letterSpacing: 0.7,
    },
});
