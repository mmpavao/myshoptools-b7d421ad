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

// Função de log de erros segura
export const safeLogError = (error) => {
  console.error("Error occurred:", error);
  try {
    // Tenta serializar o erro para garantir que seja serializável
    const serializedError = JSON.stringify(error, Object.getOwnPropertyNames(error));
    // Aqui você pode implementar uma lógica para enviar o erro serializado
    // para um serviço de log ou analytics, se necessário
  } catch (serializationError) {
    console.error("Error during error serialization:", serializationError);
  }
};

// Função para lidar com streams de forma segura
export const handleStream = async (stream) => {
  if (stream && !stream.locked) {
    const reader = stream.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        // Processe o valor aqui
        console.log(value);
      }
    } catch (error) {
      safeLogError(error);
    } finally {
      reader.releaseLock();
    }
  } else {
    console.error("Stream is not available or is already locked.");
  }
};