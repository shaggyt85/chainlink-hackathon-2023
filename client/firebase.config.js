import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyC7NnXzJb-0IHNo_pKuxF-0R9nfwgJxDUs",
    authDomain: "hackathonapp-f6622.firebaseapp.com",
    databaseURL: "https://hackathonapp-f6622-default-rtdb.firebaseio.com",
    projectId: "hackathonapp-f6622",
    storageBucket: "hackathonapp-f6622.appspot.com",
    messagingSenderId: "566727045704",
    appId: "1:566727045704:web:f559de41aca9904ecc5e7d"
  };

  const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

  const firestore = getFirestore(app);
  const storage = getStorage(app);

  export {firestore, storage, app}