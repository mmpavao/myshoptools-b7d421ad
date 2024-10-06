import { db, storage } from './config';
import { collection, addDoc, getDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { safeFirestoreOperation } from '../utils/errorReporting';

// Firestore Operations
export const createDocument = async (collectionName, data) => {
  return safeFirestoreOperation(async () => {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  });
};

export const readDocument = async (collectionName, docId) => {
  return safeFirestoreOperation(async () => {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  });
};

export const updateDocument = async (collectionName, docId, data) => {
  return safeFirestoreOperation(async () => {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
    console.log("Document successfully updated");
  });
};

export const deleteDocument = async (collectionName, docId) => {
  return safeFirestoreOperation(async () => {
    await deleteDoc(doc(db, collectionName, docId));
    console.log("Document successfully deleted");
  });
};

// Storage Operations
export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("File uploaded successfully. Download URL:", downloadURL);
    return downloadURL;
  } catch (e) {
    console.error("Error uploading file: ", e);
    throw e;
  }
};

export const deleteFile = async (path) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    console.log("File deleted successfully");
  } catch (e) {
    console.error("Error deleting file: ", e);
    throw e;
  }
};

// Test function to run all operations
export const testFirebaseOperations = async () => {
  try {
    // Test Firestore operations
    const userId = await createDocument('users', { name: 'Test User', email: 'test@example.com' });
    console.log("Created user with ID:", userId);

    const userData = await readDocument('users', userId);
    console.log("Read user data:", userData);

    await updateDocument('users', userId, { name: 'Updated Test User' });
    console.log("Updated user data");

    const updatedUserData = await readDocument('users', userId);
    console.log("Read updated user data:", updatedUserData);

    await deleteDocument('users', userId);
    console.log("Deleted user");

    // Test Storage operations
    const testFile = new Blob(['Test file content'], { type: 'text/plain' });
    const filePath = 'test/testfile.txt';
    const fileUrl = await uploadFile(testFile, filePath);
    console.log("Uploaded file URL:", fileUrl);

    await deleteFile(filePath);
    console.log("Deleted file");

    console.log("All Firebase operations completed successfully");
  } catch (error) {
    console.error("Error during Firebase operations test:", error);
  }
};
