import { db, storage, auth } from './config';
import { collection, addDoc, getDoc, updateDoc, deleteDoc, doc, getDocs, setDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { toast } from '@/components/ui/use-toast';
import crudOperations from './crudOperations';
import * as userOperations from './userOperations';
import { safeFirestoreOperation } from '../utils/errorReporting';

const productOperations = {
  createProduct: async (productData) => {
    const docRef = await addDoc(collection(db, 'products'), productData);
    return docRef.id;
  },
  getProducts: async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  updateProduct: async (productId, productData) => {
    try {
      await updateDoc(doc(db, 'products', productId), productData);
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },
  deleteProduct: (productId) => 
    deleteDoc(doc(db, 'products', productId)),
  uploadProductImage: async (file, productId) => {
    const path = `products/${productId}/${Date.now()}_${file.name}`;
    return await fileOperations.uploadFile(file, path);
  },
  getProduct: async (productId) => {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Produto não encontrado');
    }
  },
  adicionarAvaliacao: async (produtoId, userId, nota, comentario) => {
    try {
      const produtoRef = doc(db, 'products', produtoId);
      const produtoDoc = await getDoc(produtoRef);
      const userDoc = await getDoc(doc(db, 'users', userId));

      if (!produtoDoc.exists()) {
        throw new Error('Produto não encontrado');
      }

      const produtoData = produtoDoc.data();
      const avaliacoes = produtoData.avaliacoes || [];
      const userName = userDoc.exists() ? userDoc.data().displayName || 'Usuário' : 'Usuário';
      const abreviatedName = userName.split(' ')[0] + (userName.split(' ')[1] ? ` ${userName.split(' ')[1][0]}.` : '');

      const novaAvaliacao = {
        userId,
        userName: abreviatedName,
        nota,
        comentario,
        data: new Date().toISOString()
      };

      avaliacoes.push(novaAvaliacao);

      const numeroAvaliacoes = avaliacoes.length;
      const somaNotas = avaliacoes.reduce((sum, av) => sum + av.nota, 0);
      const mediaAvaliacoes = somaNotas / numeroAvaliacoes;

      await updateDoc(produtoRef, {
        avaliacoes,
        avaliacao: mediaAvaliacoes,
        numeroAvaliacoes
      });

      return true;
    } catch (error) {
      console.error('Erro ao adicionar avaliação:', error);
      throw error;
    }
  },
  importarProduto: async (userId, produto) => {
    const userProductRef = doc(db, 'users', userId, 'produtosImportados', produto.id);
    await setDoc(userProductRef, produto);
  },
  getProdutosImportados: async (userId) => {
    const userProductsRef = collection(db, 'users', userId, 'produtosImportados');
    const snapshot = await getDocs(userProductsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  getProdutosImportadosStatus: async (userId) => {
    const userProductsRef = collection(db, 'users', userId, 'produtosImportados');
    const snapshot = await getDocs(userProductsRef);
    const status = {};
    snapshot.docs.forEach(doc => {
      status[doc.id] = true;
    });
    return status;
  },
  removerProdutoImportado: async (userId, produtoId) => {
    const userProductRef = doc(db, 'users', userId, 'produtosImportados', produtoId);
    await deleteDoc(userProductRef);
  },
  verificarProdutoImportado: async (userId, produtoId) => {
    const userProductRef = doc(db, 'users', userId, 'produtosImportados', produtoId);
    const docSnap = await getDoc(userProductRef);
    return docSnap.exists();
  },
};

const fileOperations = {
  uploadFile: (file, path, onProgress) => {
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
  },
  deleteFile: (path) => deleteObject(ref(storage, path)),
  listStorageFiles: async () => {
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
  },
  uploadProfileImage: async (file, userId) => {
    const path = `avatars/${userId}/${Date.now()}_${file.name}`;
    return await fileOperations.uploadFile(file, path);
  }
};

const meusProdutosOperations = {
  getMeusProdutos: async (userId) => {
    try {
      const meusProdutosRef = collection(db, 'users', userId, 'meusProdutos');
      const snapshot = await getDocs(meusProdutosRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Erro ao buscar meus produtos:', error);
      throw error;
    }
  },

  adicionarMeuProduto: async (userId, produto) => {
    try {
      const meusProdutosRef = collection(db, 'users', userId, 'meusProdutos');
      await addDoc(meusProdutosRef, produto);
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      throw error;
    }
  },

  removerMeuProduto: async (userId, produtoId) => {
    try {
      const produtoRef = doc(db, 'users', userId, 'meusProdutos', produtoId);
      await deleteDoc(produtoRef);
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      throw error;
    }
  },

  atualizarMeuProduto: async (userId, produtoId, dadosAtualizados) => {
    try {
      const produtoRef = doc(db, 'users', userId, 'meusProdutos', produtoId);
      await updateDoc(produtoRef, dadosAtualizados);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  }
};

const testFirebaseOperations = async (logCallback) => {
  try {
    // Check if the user is authenticated
    if (!auth.currentUser) {
      throw new Error('User is not authenticated. Please log in to run the tests.');
    }

    const testDoc = await crudOperations.createDocument('test_collection', { test: 'data' });
    logCallback({ step: 'Create Document', status: 'success', message: 'Document created successfully' });

    await crudOperations.readDocument('test_collection', testDoc.id);
    logCallback({ step: 'Read Document', status: 'success', message: 'Document read successfully' });

    await crudOperations.updateDocument('test_collection', testDoc.id, { test: 'updated data' });
    logCallback({ step: 'Update Document', status: 'success', message: 'Document updated successfully' });

    await crudOperations.deleteDocument('test_collection', testDoc.id);
    logCallback({ step: 'Delete Document', status: 'success', message: 'Document deleted successfully' });

    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const uploadPath = 'test/test.txt';
    
    await fileOperations.uploadFile(testFile, uploadPath, (progress) => {
      logCallback({ step: 'Upload File', status: 'progress', message: `Upload progress: ${progress.toFixed(2)}%` });
    });
    logCallback({ step: 'Upload File', status: 'success', message: 'File uploaded successfully' });

    const files = await fileOperations.listStorageFiles();
    logCallback({ step: 'List Files', status: 'success', message: `${files.length} files listed successfully` });

    await fileOperations.deleteFile(uploadPath);
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

const firebaseOperations = {
  ...crudOperations,
  ...userOperations,
  ...productOperations,
  ...fileOperations,
  ...meusProdutosOperations,
  testFirebaseOperations,
  clearAllData
};

export default firebaseOperations;