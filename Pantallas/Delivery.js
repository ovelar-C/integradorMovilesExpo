import { Text, View, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useState } from "react";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';

export default function ViajesPantalla({ navigation }) {
    const [coords, setCoords] = useState([]);
    const [mostrarLista, setMostrarLista] = useState(false);

    const obtenerCoords = async () => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        try {
            const q = query(collection(db, 'coordenadas'), where('uid', '==', uid));
            const querySnapshot = await getDocs(q);
            const coordsArray = [];
            querySnapshot.forEach(docSnap => {
                coordsArray.push({ id: docSnap.id, ...docSnap.data() });
            });
            setCoords(coordsArray);
            setMostrarLista(true);
        } catch (error) {
            console.log('Error al obtener las coordenadas.');
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.cardText}>📍 Latitud: {item.latitude}</Text>
            <Text style={styles.cardText}>📍 Longitud: {item.longitude}</Text>
            <Text style={styles.cardFecha}>🕒 {new Date(item.timestamp.seconds * 1000).toLocaleString()}</Text>
        </View>
    );

    return (
        <View style={styles.screen}>
            {/* Blobs decorativos */}
            <View style={styles.topBlob} />
            <View style={styles.bottomBlob} />

            <View style={styles.container}>
                <Text style={styles.title}>🛵 Historial de Entregas 🛵</Text>

                {!mostrarLista ? (
                    <>
                        <Text style={styles.placeholder}>Pulsa "Registro de Entregas" para ver tus viajes</Text>
                    </>
                ) : (
                    <>
                        <FlatList
                            data={coords}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                            ListEmptyComponent={<Text style={styles.vacioText}>No hay registros aún.</Text>}
                            contentContainerStyle={coords.length === 0 ? styles.flatListVacio : styles.flatList}
                        />
                        <TouchableOpacity
                            style={[styles.bubble, styles.bubbleDanger]}
                            onPress={() => setMostrarLista(false)}
                        >
                            <Text style={styles.bubbleText}>CERRAR LISTA</Text>
                        </TouchableOpacity>
                    </>
                )}

                {/* Botones principales */}
                <TouchableOpacity
                    style={[styles.bubble, styles.bubblePrimary]}
                    onPress={obtenerCoords}
                >
                    <Text style={styles.bubbleText}>REGISTRO DE ENTREGAS</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.bubble, styles.bubbleAccent]}
                    onPress={() => navigation.navigate('Entregas')}
                >
                    <Text style={styles.bubbleText}>NUEVO DELIVERY</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.bubble, styles.bubbleDanger]}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.bubbleText}>VOLVER</Text>
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
        marginTop: 40,
        alignItems: 'center',
        padding: 18,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.85)',
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
        textAlign: 'center',
    },
    placeholder: {
        fontSize: 16,
        color: '#555',
        fontStyle: 'italic',
        marginVertical: 20,
        textAlign: 'center',
    },
    flatList: {
        paddingBottom: 10,
        width: '100%',
    },
    flatListVacio: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    vacioText: {
        fontSize: 16,
        color: '#777',
        fontStyle: 'italic',
        marginVertical: 20,
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 3,
    },
    cardText: {
        fontSize: 15,
        color: '#333',
        marginBottom: 4,
    },
    cardFecha: {
        fontSize: 13,
        color: '#777',
        marginTop: 4,
    },
    bubble: {
        width: '100%',
        paddingVertical: 16,
        alignItems: 'center',
        marginVertical: 10,
        borderRadius: 40,
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
