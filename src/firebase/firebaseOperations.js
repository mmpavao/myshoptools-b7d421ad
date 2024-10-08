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
    return await fileOperations.uploadFile(file, path);
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
};

const meusProdutosOperations = {
  // ... keep existing code (if any)
};

const userProfileOperations = {
  // ... keep existing code (if any)
};

const myShopOperations = {
  // ... keep existing code (if any)
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
