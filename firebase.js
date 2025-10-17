// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";


const firebaseConfig = {
  apiKey: "AIzaSyC8CMj6FV3BjekWqK6Ez9fEXDnwR0CyZRU",
  authDomain: "prueba-664fd.firebaseapp.com",
  projectId: "prueba-664fd",
  storageBucket: "prueba-664fd.firebasestorage.app",
  messagingSenderId: "720332506884",
  appId: "1:720332506884:web:c25e7705ae9f1df54ef251"
};


export const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app,{
    persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
