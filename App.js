import { NavigationContainer } from '@react-navigation/native' //envuelve toda la navegacion de la app
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';//metodo que usa para escuchar cambiosen el estado de autenticacion
import { auth } from './firebase';
import AppNavigator from './navegacion/appNavigator';//componente que maneja la logica de la navegacion

//APP

export default function App() {
  const [user, setUser] = useState(null);//almacena el usuario autenticado
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * listener que escucha cambios en el estado de autenticación del usuario 
     * usando onAuthStateChanged
     * si current es null, significa que no hay usuario autenticado
     * 
     */
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    /**
     * El return unsubscribe es una función de limpieza que detiene 
     * la escucha de cambios en la autenticación cuando el componente 
     * se desmonta o se vuelve a renderizar.
     */
    return unsubscribe;
  }, []);

  //Mientras loading sea true, el componente no renderiza nada
  if (loading) return null;

  //appNavigator es un componente que contiene las rutas y
  //la logica de la navegacion entre pantallas
  //el user se pasa como prop para adaptar el estado del usuario entre las pantallas
  return (
    <NavigationContainer>
      <AppNavigator user={user} />
    </NavigationContainer>
  );
}



