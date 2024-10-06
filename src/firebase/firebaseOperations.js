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
