import { db, storage } from './config';
import { collection, addDoc, getDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { safeFirestoreOperation } from '../utils/errorReporting';

// Firestore Operations
export const createDocument = (collectionName, data) => 
  safeFirestoreOperation(() => addDoc(collection(db, collectionName), data));

export const readDocument = (collectionName, docId) => 
  safeFirestoreOperation(() => getDoc(doc(db, collectionName, docId)));

export const updateDocument = (collectionName, docId, data) => 
  safeFirestoreOperation(() => updateDoc(doc(db, collectionName, docId), data));

export const deleteDocument = (collectionName, docId) => 
  safeFirestoreOperation(() => deleteDoc(doc(db, collectionName, docId)));

// Storage Operations
export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  } catch (e) {
    console.error("Error uploading file: ", e);
    throw e;
  }
};

export const deleteFile = (path) => 
  deleteObject(ref(storage, path));

// Test function to run all operations
export const testFirebaseOperations = async () => {
  try {
    const userId = await createDocument('users', { name: 'Test User', email: 'test@example.com' });
    console.log("Created user with ID:", userId);

    const userData = await readDocument('users', userId);
    console.log("Read user data:", userData.data());

    await updateDocument('users', userId, { name: 'Updated Test User' });
    console.log("Updated user data");

    const updatedUserData = await readDocument('users', userId);
    console.log("Read updated user data:", updatedUserData.data());

    await deleteDocument('users', userId);
    console.log("Deleted user");

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