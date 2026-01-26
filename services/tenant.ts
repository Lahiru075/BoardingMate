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

export const markAsPaid = async (id: string) => {
    const docRef = doc(db, "tenants", id);
    
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;

    await updateDoc(docRef, {
        lastPaidMonth: yearMonth, 
        lastPaidDate: now.toISOString(),
        electricityShare: 0, 
        waterShare: 0
    });
};

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
    // get all tenants in this room
    const q = query(collection(db, "tenants"), where("roomNo", "==", roomNo));
    const querySnapshot = await getDocs(q);
    
    const count = querySnapshot.size;
    if (count === 0) throw new Error("No tenants found in this room!");

    // get current month (Eg: "2026-01")
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;

    // check if anyone has paid for this month
    let hasAnyonePaid = false;
    let paidTenantName = "";

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.lastPaidMonth === currentMonthStr) {
            hasAnyonePaid = true;
            paidTenantName = data.name; // capture the name
        }
    });

    // if anyone has paid.. throw error
    if (hasAnyonePaid) {
        throw new Error(`Cannot add bills! ${paidTenantName} has already paid for this month.`);
    }

    // if no one has paid.. distribute the bills
    const elecShare = totalElec / count;
    const waterShare = totalWater / count;

    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
        batch.update(doc.ref, {
            electricityShare: elecShare,
            waterShare: waterShare
        });
    });

    await batch.commit();
};