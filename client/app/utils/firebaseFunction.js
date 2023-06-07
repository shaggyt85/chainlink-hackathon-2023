import { collection, doc, getDocs, orderBy, query, setDoc } from "firebase/firestore"
import { firestore } from "@/firebase.config"

// Saving new Item
export const saveItem = async (data) => {
        await setDoc(doc(firestore, 'Campaigns', `${Date.now()}` ), data, {merge : true,}
        ) 
}

export const getAllCampaigns = async () => {
    const items = await getDocs(query(collection(firestore, "Campaigns"), orderBy("id", "desc"))
    )

    return items.docs.map((doc) => doc.data())
}