import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore
import { initializeAuth , getReactNativePersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAtUMcA6fYIw_V9qvSh_X8Iv6yTBw9p4ss",
  authDomain: "boardingmate.firebaseapp.com",
  projectId: "boardingmate",
  storageBucket: "boardingmate.firebasestorage.app",
  messagingSenderId: "903024643927",
  appId: "1:903024643927:web:d8babf7976492e19ea3812",
  measurementId: "G-GD0NJFHLKD"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
})

export const db = getFirestore(app);