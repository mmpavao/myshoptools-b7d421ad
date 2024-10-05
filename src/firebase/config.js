import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

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

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

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
