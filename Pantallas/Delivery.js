import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import * as Location from 'expo-location';


//MOSTRAR REGISTRO DE VIAJE SI ES QUE HAY

export default function ViajesPantalla({ navigation }) {

    return (
        <View style={styles.contenedor}>
            <Text style={styles.titulo}>
                PANTALLA DE ENTREGAS
            </Text>
            <TouchableOpacity style={styles.boton}>
                <Text style={styles.botonText}> REGISTRO DE ENTREGAS(mostrar los registros en ESTA pantalla)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.boton}
                onPress={()=> navigation.navigate('Entregas')}
            >
                <Text style={styles.botonText}>NUEVO DELIVERY</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.boton}
                onPress={() => navigation.goBack()}>
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
    coordsContainer: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 12,
        marginBottom: 30,
        marginTop: 20,
        minWidth: '90%',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    coordsTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#495057',
    },
    coordText: {
        fontSize: 15,
        marginBottom: 3,
        color: '#6c757d',
        fontFamily: 'monospace',
    },
});
