import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { auth, db} from '../firebase';



export default function Inicio({ navigation }) {
    return (
        <View style={styles.contenedor}>
            <Text style={styles.titulo}>
                BIENVENIDO AL INICIO DE LA MEJOR APP QUE VAS A VER EN TU VIDA :D
            </Text>

            <TouchableOpacity style={styles.boton}
                onPress={() => navigation.navigate('TuPerfil')}>
                <Text style={styles.botonText}>TU PERFIL</Text>
            </TouchableOpacity>
           
            <TouchableOpacity style={styles.boton}
                onPress={() => navigation.navigate('GeoPantalla')}>
                <Text style={styles.botonText}>UBICACIONES</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.boton}
                onPress={() => navigation.navigate('ViajesPantalla')}>
                <Text style={styles.botonText}>VIAJES</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botonCerrar}
                onPress={()=> auth.signOut()} >
                <Text style={styles.botonText}>CERRAR SESION</Text>
            </TouchableOpacity>

            <Image
                source={require('../assets/alien.gif')}
                style={styles.alien}
            />

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
    botonCerrar: {
        backgroundColor: '#f82f0cff',
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
    alien:{
        width: 5.0, 
        height: 20 ,
        marginTop:30,
    }
});
