import { db, storage, auth } from './config';
import { collection, addDoc, getDoc, updateDoc, deleteDoc, doc, getDocs, setDoc, query, where, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { toast } from '@/components/ui/use-toast';
import crudOperations from './crudOperations';
import * as userOperations from './userOperations';
import { safeFirestoreOperation } from '../utils/errorReporting';

const landPageOperations = {
  getLandPageSettings: async () => {
    try {
      const docRef = doc(db, 'settings', 'landpage');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching LandPage settings:', error);
      throw error;
    }
  },

  saveLandPageSettings: async (settings) => {
    try {
      await setDoc(doc(db, 'settings', 'landpage'), settings);
      return true;
    } catch (error) {
      console.error('Error saving LandPage settings:', error);
      throw error;
    }
  },

  uploadBannerImage: async (file) => {
    const path = `landpage/banner_${Date.now()}`;
    try {
      console.log("Iniciando upload do banner para o caminho:", path);
      const downloadURL = await fileOperations.uploadFile(file, path);
      console.log("Banner uploaded successfully. Download URL:", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Erro detalhado ao fazer upload do banner:", error);
      throw new Error(`Falha ao fazer upload do banner: ${error.message}`);
    }
  },
};

const productOperations = {
  getProducts: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      const docRef = await addDoc(collection(db, 'products'), productData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
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

  deleteProduct: async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },
};

const fileOperations = {
  uploadFile: async (file, path) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Error uploading file:', error);
          reject(new Error(`Erro no upload: ${error.message}`));
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File uploaded successfully. Download URL:", downloadURL);
            resolve(downloadURL);
          } catch (error) {
            console.error('Error getting download URL:', error);
            reject(new Error(`Erro ao obter URL de download: ${error.message}`));
          }
        }
      );
    });
  },
};

const meusProdutosOperations = {
  // ... keep existing code (if any)
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
  // ... keep existing code (if any)
};

const myShopOperations = {
  // ... keep existing code (if any)
  addProductToMyShopAndHighlight: async (userId, productId) => {
    try {
      // Adiciona o produto à loja MyShop do usuário
      await addDoc(collection(db, `users/${userId}/myShopProducts`), { productId });

      // Adiciona o produto aos destaques da landing page
      const landPageRef = doc(db, 'settings', 'landpage');
      await updateDoc(landPageRef, {
        highlightedProducts: arrayUnion(productId)
      });

      return true;
    } catch (error) {
      console.error('Error adding product to MyShop and highlights:', error);
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
  ...landPageOperations,
};

export default firebaseOperations;
