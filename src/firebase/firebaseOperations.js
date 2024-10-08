import { db, storage, auth } from './config';
import { collection, addDoc, getDoc, updateDoc, deleteDoc, doc, getDocs, setDoc, query, where, arrayUnion } from 'firebase/firestore';
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

  importarProduto: async (userId, produto) => {
    const produtoImportado = {
      ...produto,
      skuOriginal: produto.sku,
      precoCusto: produto.preco,
      precoVenda: produto.vendaSugerida,
      descricaoPersonalizada: produto.descricao,
      fotosPersonalizadas: produto.fotos,
      dataImportacao: new Date().toISOString()
    };
    const userProductRef = doc(db, 'users', userId, 'produtosImportados', produto.id);
    await setDoc(userProductRef, produtoImportado);
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

const meusProdutosOperations = {
  getMeusProdutos: async (userId) => {
    try {
      const produtosImportadosRef = collection(db, 'users', userId, 'produtosImportados');
      const snapshot = await getDocs(produtosImportadosRef);
      const produtosImportados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Buscar detalhes completos dos produtos
      const produtosCompletos = await Promise.all(produtosImportados.map(async (produto) => {
        const produtoCompleto = await productOperations.getProduct(produto.id);
        return {
          ...produtoCompleto,
          dataImportacao: produto.dataImportacao || new Date().toISOString(),
          status: produto.status || 'ativo'
        };
      }));

      return produtosCompletos;
    } catch (error) {
      console.error('Erro ao buscar meus produtos:', error);
      throw error;
    }
  },
};

const userProfileOperations = {
  getUserProfile: async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },
  updateUserProfile: async (userId, profileData) => {
    try {
      await setDoc(doc(db, 'users', userId), profileData, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
};

const fileOperations = {
  uploadFile: (file, path, onProgress) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error('Error getting download URL:', error);
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
    if (!file || !userId) {
      throw new Error('Invalid file or user ID');
    }
    const fileExtension = file.name.split('.').pop();
    const path = `avatars/${userId}/${Date.now()}.${fileExtension}`;
    const downloadURL = await fileOperations.uploadFile(file, path);
    
    // Update user profile with new avatar URL
    await userOperations.updateUserProfile(userId, { photoURL: downloadURL });
    
    return downloadURL;
  }
};

const testFirebaseOperations = async (logCallback) => {
  try {
    logCallback({ step: 'Starting Firebase test', status: 'info' });
    
    // Test product creation
    const testProduct = { title: 'Test Product', price: 9.99 };
    const productId = await productOperations.createProduct(testProduct);
    logCallback({ step: 'Product created', status: 'success' });
    
    // Test product retrieval
    const retrievedProduct = await productOperations.getProduct(productId);
    logCallback({ step: 'Product retrieved', status: 'success' });
    
    // Test product update
    await productOperations.updateProduct(productId, { price: 19.99 });
    logCallback({ step: 'Product updated', status: 'success' });
    
    // Test product deletion
    await productOperations.deleteProduct(productId);
    logCallback({ step: 'Product deleted', status: 'success' });
    
    logCallback({ step: 'All Firebase operations completed successfully', status: 'success' });
  } catch (error) {
    logCallback({ step: 'Error during Firebase test', status: 'error', message: error.message });
    throw error;
  }
};

const clearAllData = async () => {
  // Implementation for clearing all data
  // This is a placeholder and should be implemented with caution
  console.warn('clearAllData function is not implemented');
};

const myShopOperations = {
  getMyShopProducts: async (userId) => {
    try {
      const userProductsRef = collection(db, 'users', userId, 'myShopProducts');
      const snapshot = await getDocs(userProductsRef);
      const productIds = snapshot.docs.map(doc => doc.id);
      
      const products = await Promise.all(productIds.map(async (id) => {
        const productDoc = await getDoc(doc(db, 'products', id));
        return { id, ...productDoc.data() };
      }));
      
      return products;
    } catch (error) {
      console.error('Error getting MyShop products:', error);
      throw error;
    }
  },

  addProductToMyShop: async (userId, productId) => {
    try {
      const userProductRef = doc(db, 'users', userId, 'myShopProducts', productId);
      await setDoc(userProductRef, { addedAt: new Date() });
    } catch (error) {
      console.error('Error adding product to MyShop:', error);
      throw error;
    }
  },
};


const pedidosOperations = {
  adicionarPedidoVendedor: async (userId, pedido) => {
    try {
      const pedidoRef = await addDoc(collection(db, 'users', userId, 'pedidos'), pedido);
      return pedidoRef.id;
    } catch (error) {
      console.error('Erro ao adicionar pedido do vendedor:', error);
      throw error;
    }
  },

  adicionarPedidoFornecedor: async (produtoId, pedido) => {
    try {
      const pedidoRef = await addDoc(collection(db, 'pedidosFornecedor'), {
        ...pedido,
        produtoId,
        statusLogistica: 'Aguardando'
      });
      return pedidoRef.id;
    } catch (error) {
      console.error('Erro ao adicionar pedido do fornecedor:', error);
      throw error;
    }
  },

  getPedidosVendedor: async (userId) => {
    try {
      const pedidosRef = collection(db, 'users', userId, 'pedidos');
      const snapshot = await getDocs(pedidosRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Erro ao buscar pedidos do vendedor:', error);
      throw error;
    }
  },

  getPedidosFornecedor: async () => {
    try {
      const pedidosRef = collection(db, 'pedidosFornecedor');
      const snapshot = await getDocs(pedidosRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Erro ao buscar pedidos do fornecedor:', error);
      throw error;
    }
  },

  atualizarStatusPedidoFornecedor: async (pedidoId, novoStatus) => {
    try {
      const pedidoRef = doc(db, 'pedidosFornecedor', pedidoId);
      await updateDoc(pedidoRef, { statusLogistica: novoStatus });
    } catch (error) {
      console.error('Erro ao atualizar status do pedido do fornecedor:', error);
      throw error;
    }
  },

  atualizarEstoque: async (produtoId, novaQuantidade) => {
    try {
      const produtoRef = doc(db, 'products', produtoId);
      await updateDoc(produtoRef, { estoque: novaQuantidade });
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      throw error;
    }
  },
};

const firebaseOperations = {
  ...crudOperations,
  ...userOperations,
  ...productOperations,
  ...fileOperations,
  ...meusProdutosOperations,
  ...userProfileOperations,
  ...myShopOperations,
  ...pedidosOperations,
  testFirebaseOperations,
  clearAllData
};

export default firebaseOperations;