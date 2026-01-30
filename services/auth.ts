import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, updateEmail, updatePassword } from "firebase/auth"
import { auth, db } from "./firebase"
import { doc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { use } from "react";

export const login = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
}

export const registation = async (fullname: string, email: string, password: string) => {
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(await userCredential.user, {
        displayName: fullname
    })

    setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        fullname: fullname,
        email: email,
        createdAt: new Date()
    });

    return userCredential
}

export const logout = async () => {
    await auth.signOut();
    AsyncStorage.clear();
    return;
}