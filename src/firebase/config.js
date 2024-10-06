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
  apiKey: import.meta.env.VITE_OPENAI_API_KEY // Use an environment variable instead of hardcoding the key
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export { openAIConfig };

// Add the safeLogError function
export const safeLogError = (error) => {
  console.error("Safely logged error:", error);
  // You can add more error logging logic here if needed
};

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