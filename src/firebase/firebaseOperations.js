import { db, storage } from './config';
import { collection, addDoc, getDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
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

export const uploadFile = async (file, path, onProgress) => {
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
          if (error.code === 'storage/unauthorized') {
            reject(new Error('Erro de autorização. Verifique as regras do Firebase Storage.'));
          } else if (error.name === 'AbortError') {
            reject(new Error('Upload cancelado devido a um erro de CORS. Verifique as configurações do Firebase.'));
          } else {
            reject(error);
          }
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

export const deleteFile = (path) => 
  deleteObject(ref(storage, path));

export const listStorageFiles = async () => {
  const folders = ['uploads', 'avatars'];
  let allFiles = [];

  for (const folder of folders) {
    const listRef = ref(storage, folder);
    try {
      const res = await listAll(listRef);
      console.log(`Listando arquivos em ${folder}:`, res.items);
      const folderFiles = await Promise.all(res.items.map(async (itemRef) => {
        try {
          const url = await getDownloadURL(itemRef);
          console.log(`URL obtida para ${itemRef.name}:`, url);
          return { name: itemRef.name, url, folder };
        } catch (error) {
          console.error(`Erro ao obter URL para ${itemRef.name}:`, error);
          toast({
            title: "Erro de Acesso",
            description: `Não foi possível acessar ${itemRef.name}. Erro: ${error.message}`,
            variant: "destructive",
          });
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

  console.log("Todos os arquivos listados:", allFiles);
  return allFiles;
};

export const testFirebaseOperations = async (logCallback) => {
  try {
    // Test Firestore operations
    const testDoc = await createDocument('test_collection', { test: 'data' });
    logCallback({ step: 'Create Document', status: 'success', message: 'Document created successfully' });

    const readDoc = await readDocument('test_collection', testDoc.id);
    logCallback({ step: 'Read Document', status: 'success', message: 'Document read successfully' });

    await updateDocument('test_collection', testDoc.id, { test: 'updated data' });
    logCallback({ step: 'Update Document', status: 'success', message: 'Document updated successfully' });

    await deleteDocument('test_collection', testDoc.id);
    logCallback({ step: 'Delete Document', status: 'success', message: 'Document deleted successfully' });

    // Test Storage operations
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

export const clearAllData = async () => {
  try {
    // Limpar Firestore
    const collections = ['test_collection', 'products', 'orders'];
    for (const collectionName of collections) {
      const querySnapshot = await getDocs(collection(db, collectionName));
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    }

    // Limpar Storage
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
