import React from 'react';
//createNativestacknavigator e sun tipo de navegacion stack
//las pantallas se apilan una encima de la otra
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//importacion de las pantallas a usar
import Inicio from '../Pantallas/pantallaInicio';
import MisViajes from '../Pantallas/pantallaMisViajes';
import NuevoViaje from '../Pantallas/pantallaNuevoViaje';
import Login from '../Pantallas/pantallaLogin';
import EditarPerfil from '../Pantallas/pantallaEditarPerfil';
import Mapa from '../Pantallas/Mapa';
import TuPerfil from '../Pantallas/pantallaPerfil'
import ViajesPantalla from '../Pantallas/pantallaViajes'
import GeoPantalla from '../Pantallas/PantallaGeo'

//NAVEGACION

//creamos el navegador stack para gestionar las pantallas
const Stack = createNativeStackNavigator();

//user es el prop y evaluamos si es null, si es null no esta autenticado
//stack navigator es el contenedor de las pantallas que forma el stack
/**
 * si el user es null entonces mostrara el login sino
 * se mostrara home y configuracion es decir es stack de pantallas que le damos
 */

export default function AppNavigator({ user }) {
    return (
        <Stack.Navigator>
            {!user ? (
                <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
            ) : (
                <>
                    <Stack.Screen name="Inicio" component={Inicio} />
                    <Stack.Screen name="EditarPerfil" component={EditarPerfil} />
                    <Stack.Screen name="MisViajes" component={MisViajes} />
                    <Stack.Screen name="NuevoViaje" component={NuevoViaje} />
                    <Stack.Screen name="Mapa" component={Mapa} />
                    <Stack.Screen name="TuPerfil" component={TuPerfil} />
                    <Stack.Screen name="ViajesPantalla" component={ViajesPantalla} />
                    <Stack.Screen name="GeoPantalla" component={GeoPantalla} />
                </>
            )}
        </Stack.Navigator>
    );
}