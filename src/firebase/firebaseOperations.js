import { db, storage, auth } from './config';
import { collection, addDoc, getDoc, updateDoc, deleteDoc, doc, getDocs, setDoc, query, where, arrayUnion, limit } from 'firebase/firestore';
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

const landPageOperations = {
  getLandPageSettings: async () => {
    try {
      const docRef = doc(db, 'settings', 'landpage');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No LandPage settings found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching LandPage settings:", error);
      throw error;
    }
  },
  saveLandPageSettings: async (settings) => {
    try {
      const docRef = doc(db, 'settings', 'landpage');
      await setDoc(docRef, settings, { merge: true });
      return true;
    } catch (error) {
      console.error("Error saving LandPage settings:", error);
      throw error;
    }
  },
  uploadBannerImage: async (file) => {
    if (!file) {
      throw new Error('No file provided');
    }
    const path = `landpage/banner_${Date.now()}.${file.name.split('.').pop()}`;
    const downloadURL = await fileOperations.uploadFile(file, path);
    
    // Update landpage settings with new banner URL
    await landPageOperations.saveLandPageSettings({ bannerUrl: downloadURL });
    
    return downloadURL;
  },

  getFeaturedProducts: async () => {
    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('featured', '==', true), limit(3));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching featured products:", error);
      throw error;
    }
  },
};

const firebaseOperations = {
  ...crudOperations,
  ...userOperations,
  ...productOperations,
  ...fileOperations,
  ...userProfileOperations,
  ...meusProdutosOperations,
  ...landPageOperations,
};

export default firebaseOperations;
