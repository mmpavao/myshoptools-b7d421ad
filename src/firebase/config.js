import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, auth, db, storage, analytics };

export const handleFetchError = async (promise) => {
  try {
    const result = await promise;
    return result;
  } catch (error) {
    console.error("Fetch error:", error);
    const simpleError = {
      message: error.message,
      code: error.code,
    };
    if (typeof window !== 'undefined' && window.reportError) {
      window.reportError(simpleError);
    }
    return null;
  }
};

export const handleFirestoreStream = (stream) => {
  if (stream && typeof stream.getReader === 'function') {
    const reader = stream.getReader();
    return new ReadableStream({
      start(controller) {
        function push() {
          reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            controller.enqueue(value);
            push();
          }).catch(error => {
            console.error("Stream reading error:", error);
            controller.error(error);
          });
        }
        push();
      }
    });
  }
  return stream;
};