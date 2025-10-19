import { createNativeStackNavigator } from '@react-navigation/native-stack';

//importacion de las pantallas a usar
import Inicio from '../Pantallas/Inicio';
import Entregas from '../Pantallas/pantallaEntregas';
import Login from '../Pantallas/Login';
import EditarPerfil from '../Pantallas/EditarPerfil';
import TuPerfil from '../Pantallas/Perfil'
import Delivery from '../Pantallas/Delivery'

//NAVEGACION

//creamos el navegador stack para gestionar las pantallas
const Stack = createNativeStackNavigator();

export default function AppNavigator({ user }) {
    return (
        <Stack.Navigator>
            {!user ? (
                <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
            ) : (
                <>
                    <Stack.Screen name="Inicio" component={Inicio} />
                    <Stack.Screen name="EditarPerfil" component={EditarPerfil} />
                    <Stack.Screen name="Entregas" component={Entregas} />
                    <Stack.Screen name="TuPerfil" component={TuPerfil} />
                    <Stack.Screen name="Delivery" component={Delivery} />
                </>
            )}
        </Stack.Navigator>
    );
}