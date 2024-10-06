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
  // Implement logic to send the error to a logging service if needed
};

export const handleStream = async (streamGetter) => {
  try {
    const stream = await streamGetter();
    if (stream && typeof stream.getReader === 'function') {
      let reader;
      try {
        reader = stream.getReader();
      } catch (readerError) {
        console.warn("Stream is already locked. Proceeding without reading.");
        return;
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

const createSimplifiedObject = (obj) => {
  if (obj instanceof Request) {
    return {
      url: obj.url,
      method: obj.method,
      headers: Object.fromEntries(obj.headers.entries()),
    };
  }
  if (obj instanceof ReadableStream) {
    return { type: 'ReadableStream' };
  }
  if (obj instanceof Blob) {
    return { type: 'Blob', size: obj.size, type: obj.type };
  }
  if (obj instanceof ArrayBuffer) {
    return { type: 'ArrayBuffer', byteLength: obj.byteLength };
  }
  if (typeof obj === 'function') {
    return `[Function: ${obj.name || 'anonymous'}]`;
  }
  if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, createSimplifiedObject(value)])
    );
  }
  return obj;
};

export const safePostMessage = (targetWindow, message, targetOrigin, transfer) => {
  try {
    let simplifiedMessage = createSimplifiedObject(message);
    targetWindow.postMessage(simplifiedMessage, targetOrigin, transfer);
  } catch (error) {
    safeLogError(error);
    console.error("Failed to post message:", error);
  }
};