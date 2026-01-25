import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where, writeBatch } from "firebase/firestore";
import { db } from "./firebase";
import { getAuth } from "firebase/auth";

const auth = getAuth();
const tenantsCollection = collection(db, "tenants");

export const addTenant = async (tenantData: {
    name: string;
    phone: string;
    roomNo: string;
    rentAmount: number;
    keyMoneyAmount: number;
    isKeyMoneyPaid: boolean;
}) => {
    try {
        const user = auth.currentUser;

        if (!user) {
            throw new Error("User not authenticated");
        }

        const newDoc = await addDoc(tenantsCollection, {
            ...tenantData,
            userId: user.uid,
            electricityShare: 0,
            waterShare: 0,
            lastPaidDate: null,
            joinedDate: serverTimestamp(),
        })

        return newDoc.id;

    } catch (error: any) {
        console.log("Error adding tenants..")
    }
}

export const getAllTenantsByUserId = async () => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("User not authenticated");
    }

    const q = query(tenantsCollection, where("userId", "==", user.uid));

    const spanshot = await getDocs(q);

    return spanshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

export const getTenantById = async (tenantId: string) => {
    const docRef = doc(db, "tenants", tenantId);
    const spanshot = await getDoc(docRef);

    if (spanshot.exists()) {
        return spanshot.data();
    }

    return null;
}

export const markAsPaid = async (tenantId: string) => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("User not authenticated");
    }

    const docRef = doc(db, "tenants", tenantId);
    await updateDoc(docRef, {
        lastPaidDate: serverTimestamp(),
        electricityShare: 0,
        waterShare: 0,
    });

}

export const deleteTenant = async (tenantId: string) => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("User not authenticated");
    }

    const docRef = doc(db, "tenants", tenantId);
    await deleteDoc(docRef);
}

export const updateTenant = async (tenantId: string, updatedData: any) => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("User not authenticated");
    }

    const docRef = doc(db, "tenants", tenantId);
    await updateDoc(docRef, updatedData);

}

export const distributeBills = async (roomNo: string, totalElec: number, totalWater: number) => {
    const q = query(
        collection(db, "tenants"),
        where("roomNo", "==", roomNo)
    );

    const snapshot = await getDocs(q);

    const tenantCount = snapshot.docs.length;

    if (tenantCount === 0) {
        console.log("No tenants in this room");
        return;
    }

    const elecShare = totalElec / tenantCount;
    const waterShare = totalWater / tenantCount;

    snapshot.docs.forEach(async (doc) => {
        await updateDoc(doc.ref, {
            electricityShare: elecShare,
            waterShare: waterShare,
        });
    });
};