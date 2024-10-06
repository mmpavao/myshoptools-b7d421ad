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
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          console.log(value);
        }
      } catch (readerError) {
        console.warn("Error reading stream:", readerError);
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

const createSafeObject = (obj) => {
  if (obj instanceof Request) {
    return {
      type: 'Request',
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
  if (Array.isArray(obj)) {
    return obj.map(createSafeObject);
  }
  if (typeof obj === 'object' && obj !== null) {
    const safeObj = {};
    for (const [key, value] of Object.entries(obj)) {
      safeObj[key] = createSafeObject(value);
    }
    return safeObj;
  }
  return obj;
};

export const safePostMessage = (targetWindow, message, targetOrigin) => {
  try {
    const safeMessage = createSafeObject(message);
    targetWindow.postMessage(safeMessage, targetOrigin);
  } catch (error) {
    safeLogError(error);
    console.error("Failed to post message:", error);
    // Fallback: send a simplified error message
    try {
      targetWindow.postMessage({ error: "Failed to send original message" }, targetOrigin);
    } catch (fallbackError) {
      console.error("Failed to send fallback error message:", fallbackError);
    }
  }
};