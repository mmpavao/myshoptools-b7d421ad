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

export const safeLogError = (error) => {
  console.error("Error occurred:", error);
  try {
    const safeError = {
      message: error.message,
      name: error.name,
      stack: error.stack,
    };
    const serializedError = JSON.stringify(safeError);
    // Implement logic to send the serialized error to a logging service if needed
  } catch (serializationError) {
    console.error("Error during error serialization:", serializationError);
  }
};

export const handleStream = async (streamGetter) => {
  try {
    const stream = await streamGetter();
    if (stream && typeof stream.getReader === 'function') {
      let reader;
      try {
        reader = stream.getReader();
      } catch (readerError) {
        if (readerError.message.includes('locked to a reader')) {
          console.warn("Stream is already locked. Proceeding without reading.");
          return;
        }
        throw readerError;
      }
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          console.log(value);
        }
      } finally {
        if (reader && typeof reader.releaseLock === 'function') {
          reader.releaseLock();
        }
      }
    } else {
      console.error("Stream is not available or does not have a getReader method.");
    }
  } catch (error) {
    safeLogError(error);
  }
};

const createRequestClone = (request) => {
  return {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    // Não incluímos o body, pois ele pode não ser clonável
  };
};

export const safePostMessage = (targetWindow, message, targetOrigin, transfer) => {
  try {
    let clonedMessage = message;
    if (message instanceof Request) {
      clonedMessage = createRequestClone(message);
    } else if (typeof structuredClone === 'function') {
      clonedMessage = structuredClone(message);
    } else {
      clonedMessage = JSON.parse(JSON.stringify(message));
    }
    targetWindow.postMessage(clonedMessage, targetOrigin, transfer);
  } catch (error) {
    safeLogError(error);
    console.error("Failed to post message:", error);
  }
};