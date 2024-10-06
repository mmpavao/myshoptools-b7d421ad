import { db, storage, auth } from './config';
import { collection, addDoc, getDoc, updateDoc, deleteDoc, doc, getDocs, query, where, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { safeFirestoreOperation } from '../utils/errorReporting';
import { toast } from '@/components/ui/use-toast';

// Basic CRUD operations
const createDocument = (collectionName, data) => 
  safeFirestoreOperation(() => addDoc(collection(db, collectionName), data));

const readDocument = (collectionName, docId) => 
  safeFirestoreOperation(() => getDoc(doc(db, collectionName, docId)));

const updateDocument = (collectionName, docId, data) => 
  safeFirestoreOperation(() => updateDoc(doc(db, collectionName, docId), data));

const deleteDocument = (collectionName, docId) => 
  safeFirestoreOperation(() => deleteDoc(doc(db, collectionName, docId)));

// User profile operations
const createUser = (userData) => 
  safeFirestoreOperation(() => setDoc(doc(db, 'users', userData.uid), userData));

const updateUserProfile = async (userId, profileData) => {
  try {
    await setDoc(doc(db, 'users', userId), profileData, { merge: true });
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: profileData.displayName,
        photoURL: profileData.photoURL,
      });
    }
    console.log('User profile updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// File operations
const uploadFile = async (file, path, onProgress) => {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      reject,
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

const uploadProfileImage = async (file, userId) => {
  const path = `avatars/${userId}_${Date.now()}_${file.name}`;
  try {
    const downloadURL = await uploadFile(file, path);
    await updateUserProfile(userId, { photoURL: downloadURL });
    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile image: ", error);
    throw error;
  }
};

const deleteFile = async (path) => {
  try {
    await deleteObject(ref(storage, path));
    console.log(`File deleted successfully: ${path}`);
  } catch (error) {
    console.error(`Error deleting file: ${path}`, error);
    throw error;
  }
};

const listStorageFiles = async () => {
  const folders = ['uploads', 'avatars'];
  let allFiles = [];

  for (const folder of folders) {
    try {
      const res = await listAll(ref(storage, folder));
      const folderFiles = await Promise.all(res.items.map(async (itemRef) => {
        try {
          const url = await getDownloadURL(itemRef);
          return { name: itemRef.name, url, folder };
        } catch (error) {
          console.error(`Error getting URL for ${itemRef.name}:`, error);
          return null;
        }
      }));
      allFiles = [...allFiles, ...folderFiles.filter(Boolean)];
    } catch (error) {
      console.error(`Error listing files in ${folder}:`, error);
      toast({
        title: "Listing Error",
        description: `Couldn't list files in ${folder}. Error: ${error.message}`,
        variant: "destructive",
      });
    }
  }

  return allFiles;
};

// Test functions
const testFirebaseOperations = async (logCallback) => {
  try {
    const testDoc = await createDocument('test_collection', { test: 'data' });
    logCallback({ step: 'Create Document', status: 'success', message: 'Document created successfully' });

    await readDocument('test_collection', testDoc.id);
    logCallback({ step: 'Read Document', status: 'success', message: 'Document read successfully' });

    await updateDocument('test_collection', testDoc.id, { test: 'updated data' });
    logCallback({ step: 'Update Document', status: 'success', message: 'Document updated successfully' });

    await deleteDocument('test_collection', testDoc.id);
    logCallback({ step: 'Delete Document', status: 'success', message: 'Document deleted successfully' });

    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const uploadPath = 'test/test.txt';
    
    await uploadFile(testFile, uploadPath, (progress) => {
      logCallback({ step: 'Upload File', status: 'progress', message: `Upload progress: ${progress.toFixed(2)}%` });
    });
    logCallback({ step: 'Upload File', status: 'success', message: 'File uploaded successfully' });

    const files = await listStorageFiles();
    logCallback({ step: 'List Files', status: 'success', message: `${files.length} files listed successfully` });

    await deleteFile(uploadPath);
    logCallback({ step: 'Delete File', status: 'success', message: 'File deleted successfully' });

    logCallback({ step: 'All Tests', status: 'success', message: 'All Firebase operations completed successfully' });
  } catch (error) {
    console.error('Error during Firebase operations test:', error);
    logCallback({ step: 'Error', status: 'error', message: `Test failed: ${error.message}` });
  }
};

const clearAllData = async () => {
  const collections = ['test_collection', 'products', 'orders'];
  const folders = ['uploads', 'avatars', 'products'];

  try {
    for (const collectionName of collections) {
      const querySnapshot = await getDocs(collection(db, collectionName));
      await Promise.all(querySnapshot.docs.map(doc => deleteDoc(doc.ref)));
    }

    for (const folder of folders) {
      const listRef = ref(storage, folder);
      const res = await listAll(listRef);
      await Promise.all(res.items.map(itemRef => deleteObject(itemRef)));
    }

    console.log('All data cleared successfully.');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};

export {
  createDocument,
  readDocument,
  updateDocument,
  deleteDocument,
  createUser,
  updateUserProfile,
  getUserProfile,
  uploadFile,
  uploadProfileImage,
  deleteFile,
  listStorageFiles,
  testFirebaseOperations,
  clearAllData
};