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

// Safe error logging function
export const safeLogError = (error) => {
  console.error("Error occurred:", error);
  try {
    const safeError = {
      message: error.message,
      name: error.name,
      stack: error.stack,
    };
    const serializedError = JSON.stringify(safeError);
    // Here you can implement logic to send the serialized error
    // to a logging service or analytics, if needed
  } catch (serializationError) {
    console.error("Error during error serialization:", serializationError);
  }
};

// Safe stream handling function
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
          // Process the value here
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

// Safe object cloning function
const safeClone = (obj) => {
  if (obj instanceof Request) {
    // Create a new request with the same properties
    return new Request(obj.url, {
      method: obj.method,
      headers: new Headers(obj.headers),
      mode: obj.mode,
      credentials: obj.credentials,
      cache: obj.cache,
      redirect: obj.redirect,
      referrer: obj.referrer,
      integrity: obj.integrity,
      body: obj.bodyUsed ? undefined : obj.body
    });
  }
  // For other objects, use structured clone if available, otherwise fall back to JSON
  return typeof structuredClone === 'function' ? structuredClone(obj) : JSON.parse(JSON.stringify(obj));
};

// Safe postMessage function
export const safePostMessage = (targetWindow, message, targetOrigin, transfer) => {
  try {
    let clonedMessage;
    if (message instanceof Request) {
      // Handle Request objects specially
      clonedMessage = {
        type: 'Request',
        url: message.url,
        method: message.method,
        headers: Object.fromEntries(message.headers.entries()),
        // Note: We can't clone the body if it's already been used
        bodyUsed: message.bodyUsed
      };
    } else {
      clonedMessage = safeClone(message);
    }
    targetWindow.postMessage(clonedMessage, targetOrigin, transfer);
  } catch (error) {
    safeLogError(error);
    console.error("Failed to post message:", error);
  }
};