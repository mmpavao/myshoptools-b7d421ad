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

// User-related operations
const createUser = (userData) => 
  safeFirestoreOperation(() => setDoc(doc(db, 'users', userData.uid), userData));

const updateUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, profileData, { merge: true });
    
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: profileData.displayName,
        photoURL: profileData.photoURL,
        phoneNumber: profileData.phoneNumber,
      });
    }
    
    console.log('Perfil do usuário atualizado com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao atualizar perfil do usuário:', error);
    throw error;
  }
};

// File operations
const uploadFile = async (file, path, onProgress) => {
  try {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.error("Error uploading file: ", error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error("Error getting download URL: ", error);
            reject(error);
          }
        }
      );
    });
  } catch (e) {
    console.error("Error initializing upload: ", e);
    throw e;
  }
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
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
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
    const listRef = ref(storage, folder);
    try {
      const res = await listAll(listRef);
      const folderFiles = await Promise.all(res.items.map(async (itemRef) => {
        try {
          const url = await getDownloadURL(itemRef);
          return { name: itemRef.name, url, folder };
        } catch (error) {
          console.error(`Erro ao obter URL para ${itemRef.name}:`, error);
          return null;
        }
      }));
      allFiles = [...allFiles, ...folderFiles.filter(item => item !== null)];
    } catch (error) {
      console.error(`Erro ao listar arquivos em ${folder}:`, error);
      toast({
        title: "Erro de Listagem",
        description: `Não foi possível listar arquivos em ${folder}. Erro: ${error.message}`,
        variant: "destructive",
      });
    }
  }

  return allFiles;
};

// Test and initialization functions
const testFirebaseOperations = async (logCallback) => {
  try {
    const testDoc = await createDocument('test_collection', { test: 'data' });
    logCallback({ step: 'Create Document', status: 'success', message: 'Document created successfully' });

    const readDoc = await readDocument('test_collection', testDoc.id);
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
  try {
    const collections = ['test_collection', 'products', 'orders'];
    for (const collectionName of collections) {
      const querySnapshot = await getDocs(collection(db, collectionName));
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    }

    const folders = ['uploads', 'avatars', 'products'];
    for (const folder of folders) {
      const listRef = ref(storage, folder);
      const res = await listAll(listRef);
      res.items.forEach(async (itemRef) => {
        await deleteObject(itemRef);
      });
    }

    console.log('Todos os dados foram apagados com sucesso.');
  } catch (error) {
    console.error('Erro ao apagar dados:', error);
    throw error;
  }
};

const initializeCollections = async () => {
  try {
    await createUser({ uid: 'testUser', name: 'Test User', email: 'test@example.com' });
    await createOrder({ userId: 'testUser', products: ['testProductId'], total: 9.99 });
    await createCategory({ name: 'Test Category' });
    await createReview({ userId: 'testUser', productId: 'testProductId', rating: 5, comment: 'Great product!' });
    console.log('Coleções inicializadas com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar coleções:', error);
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
  uploadFile,
  uploadProfileImage,
  deleteFile,
  listStorageFiles,
  testFirebaseOperations,
  clearAllData,
  initializeCollections
};
