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
      const reader = stream.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          // Process the value here
          console.log(value);
        }
      } finally {
        reader.releaseLock();
      }
    } else {
      console.error("Stream is not available or does not have a getReader method.");
    }
  } catch (error) {
    safeLogError(error);
  }
};

// Safe object cloning function
export const safeClone = (obj) => {
  if (obj instanceof Request) {
    // Create a new request with the same properties
    return new Request(obj.url, {
      method: obj.method,
      headers: new Headers(obj.headers),
      body: obj.bodyUsed ? null : obj.body, // Set body to null if it's already used
      mode: obj.mode,
      credentials: obj.credentials,
      cache: obj.cache,
      redirect: obj.redirect,
      referrer: obj.referrer,
      integrity: obj.integrity,
    });
  }
  // For other objects, use structured clone if available, otherwise fall back to JSON
  return typeof structuredClone === 'function' ? structuredClone(obj) : JSON.parse(JSON.stringify(obj));
};

// Safe postMessage function
export const safePostMessage = (window, message, targetOrigin, transfer) => {
  try {
    const clonedMessage = safeClone(message);
    window.postMessage(clonedMessage, targetOrigin, transfer);
  } catch (error) {
    safeLogError(error);
    console.error("Failed to post message:", error);
  }
};