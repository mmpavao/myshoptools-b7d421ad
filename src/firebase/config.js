import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { collection, getDocs, query, limit, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const openAIConfig = {
  apiKey: "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"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export { openAIConfig };

const initializeCollections = async () => {
  const collectionsToInitialize = ['bots', 'user_settings'];
  
  for (const collectionName of collectionsToInitialize) {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log(`Initializing collection: ${collectionName}`);
      await addDoc(collectionRef, { initialized: true });
    }
  }
};

initializeCollections().catch(console.error);
