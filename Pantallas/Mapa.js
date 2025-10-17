import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';


//gracias chatgept

/**
 *  MapView: componente para mostrar el mapa.
 *  Marker: un pin que se muestra en una ubicación específica
 */

export default function Mapa({navigation}) {
    //estado para guardar la ubicacion
    const [location, setLocation] = useState(null);

    useEffect(() => {
        (async () => {
            //pedimos permiso para usar la ubicacion
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permiso de ubicación denegado');
                return;
            }

            //si se otorga la guardamos
            const loc = await Location.getCurrentPositionAsync({});
            setLocation(loc.coords);
        })();
    }, []);

    return (
        <View style={styles.container}>
            {/*solo se muestra el mapa si hay ubicacion */}
            {location && (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    showsUserLocation={true}
                    followsUserLocation={true}
                >
                    <Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }}
                        title="Estás aquí"
                    />
                </MapView>
            )}
            <View style={styles.contenedor}>
                <Text style={styles.titulo}>
                    NO HAY ACCESO A LA UBICACIÓN D:
                </Text>
                <TouchableOpacity style={styles.boton}
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.botonText}> VOLVER</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
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
});
