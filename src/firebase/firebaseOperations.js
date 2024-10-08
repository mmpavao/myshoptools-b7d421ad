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

const firebaseOperations = {
  ...crudOperations,
  ...userOperations,
  ...productOperations,
  ...fileOperations,
  ...meusProdutosOperations,
  ...userProfileOperations,
  ...myShopOperations,
  ...landPageOperations,
  testFirebaseOperations,
  clearAllData
};

export default firebaseOperations;
