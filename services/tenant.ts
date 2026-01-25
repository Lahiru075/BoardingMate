import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

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

        const tenantsRef = collection(db, "tenants");

        const newDoc = await addDoc(tenantsRef, {
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