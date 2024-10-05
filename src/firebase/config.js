import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDXg0YiXBWBwhlj93AzScEmNDRv9z5OxUw",
  authDomain: "myshoptools-84ff5.firebaseapp.com",
  projectId: "myshoptools-84ff5",
  storageBucket: "myshoptools-84ff5.appspot.com",
  messagingSenderId: "427428494009",
  appId: "1:427428494009:web:6b85c08629753650773968",
  measurementId: "G-81J0Q7J2Y1"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Use emulators in development environment
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
  console.log("Connected to Firebase emulators");
}

export { app, analytics, auth, db, storage };

// Helper function to handle fetch errors
export const handleFetchError = async (promise) => {
  try {
    const result = await promise;
    return result;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// Wrapper function for Firestore operations
export const handleFirestoreOperation = async (operation) => {
  try {
    const result = await operation();
    return result;
  } catch (error) {
    console.error("Firestore operation error:", error);
    throw error;
  }
};