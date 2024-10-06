import { db, storage } from './config';
import { collection, addDoc, getDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { safeFirestoreOperation } from '../utils/errorReporting';
import { toast } from '@/components/ui/use-toast';

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

export const testFirebaseOperations = async () => {
  try {
    const userDocRef = await createDocument('users', { name: 'Test User', email: 'test@example.com' });
    console.log("Created user with ID:", userDocRef.id);

    const userDocSnapshot = await readDocument('users', userDocRef.id);
    console.log("Read user data:", userDocSnapshot.data());

    await updateDocument('users', userDocRef.id, { name: 'Updated Test User' });
    console.log("Updated user data");

    const updatedUserDocSnapshot = await readDocument('users', userDocRef.id);
    console.log("Read updated user data:", updatedUserDocSnapshot.data());

    await deleteDocument('users', userDocRef.id);
    console.log("Deleted user");

    const testFile = new Blob(['Test file content'], { type: 'text/plain' });
    const filePath = `test/testfile_${Date.now()}.txt`;
    const fileUrl = await uploadFile(testFile, filePath);
    console.log("Uploaded file URL:", fileUrl);

    await deleteFile(filePath);
    console.log("Deleted file");

    toast({
      title: "Firebase Operations Test",
      description: "All operations completed successfully",
    });
  } catch (error) {
    console.error("Error during Firebase operations test:", error);
    toast({
      title: "Firebase Operations Test Error",
      description: error.message,
      variant: "destructive",
    });
  }
};
