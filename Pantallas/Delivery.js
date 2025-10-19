import { Text, View, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useState } from "react";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';

export default function ViajesPantalla({ navigation }) {
    const [coords, setCoords] = useState([]);
    const [mostrarLista, setMostrarLista] = useState(false);

    //obtenemos el registro de las coordenadas
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
            console.log('Error al obtener las notas.');
        }
    };
    //mostramos los datos
    const renderItem = ({ item }) => (
        <View style={styles.coordItem}>
            <Text>Latitud: {item.latitude}</Text>
            <Text>Longitud: {item.longitude}</Text>
            <Text>Fecha: {new Date(item.timestamp.seconds * 1000).toLocaleString()}</Text>
        </View>
    );

    return (
        <View style={styles.contenedor}>
            <Text style={styles.titulo}>
                🛵 ​ PANTALLA DE ENTREGAS  🛵
            </Text>
            <View style={styles.contenedorBoton}>
                <TouchableOpacity style={styles.boton}
                    onPress={obtenerCoords}>
                    <Text style={styles.botonText}> REGISTRO DE ENTREGAS</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.boton}
                    onPress={() => navigation.navigate('Entregas')}
                >
                    <Text style={styles.botonText}>NUEVO DELIVERY</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.boton}
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.botonText}> VOLVER</Text>
                </TouchableOpacity>
            </View>

            {!mostrarLista ? (
                <View style={styles.contenedorCerrar}>
                    <Text style={styles.emote}>🛵</Text>

                </View>
            ) : (
                <View style={styles.contenedorFlatlist}>
                    <TouchableOpacity style={styles.botonCerrar} onPress={() => setMostrarLista(false)}>
                        <Text style={styles.botonText}> CERRAR</Text>
                    </TouchableOpacity>

                    {mostrarLista && (
                        <FlatList
                            data={coords}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                            ListEmptyComponent={<Text style={styles.vacioText}>No hay registros aún.</Text>}
                            contentContainerStyle={coords.length === 0 ? styles.flatListVacio : styles.flatList}
                        />
                    )}
                </View>
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        justifyContent: 'flex-start',
        alignContent: 'center',
        backgroundColor: 'yellow',
        padding: 20,
    },
    titulo: {
        textAlign: 'center',
        padding: 10,
        backgroundColor: '#e27720ff',
        color: 'white',
        padding: 15,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 20,
        fontWeight: 'bold',
        fontSize: 20,
    },
    contenedorBoton: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexWrap: 'wrap',                
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    boton: {
        backgroundColor: '#3498db',
        padding: 10,
        margin: 5,
        paddingHorizontal: 12,   
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3498db',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        flexShrink: 1, 
    },
    botonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    contenedorCerrar: {
        height: 140,
        width:90,
        backgroundColor: '#e7db2b',
        position: 'absolute',
        top: 120,       
        right: 20,     
        padding: 10,
        borderRadius: 20,
        zIndex: 10, 
    },
    emote:{
        fontSize:60,
    },
    botonCerrar: {
        position: 'absolute',
        top: -115,       // espacio desde arriba
        right: 15,     // espacio desde la derecha
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 20,
        zIndex: 10,    // para que quede encima de otros elementos
    },
    coordItem: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        marginVertical: 8,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,

    },
    contenedorFlatlist: {
        height: 400,
        borderRadius: 30
    },
    flatList: {
        paddingBottom: 30,
        paddingHorizontal: 5,
    },
    flatListVacio: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    vacioText: {
        fontSize: 18,
        color: '#757575',
        fontStyle: 'italic',
    },
});
