import crudOperations from './crudOperations';
import * as userOperations from './userOperations';
import productOperations from './productOperations';
import fileOperations from './fileOperations';
import meusProdutosOperations from './meusProdutosOperations';
import userProfileOperations from './userProfileOperations';
import dashboardOperations from './dashboardOperations';
import { collection, addDoc, updateDoc, doc, increment, getDocs, query, where, getDoc } from 'firebase/firestore';
import { db } from './config';

const firebaseOperations = {
  ...crudOperations,
  ...userOperations,
  ...productOperations,
  ...fileOperations,
  ...meusProdutosOperations,
  ...userProfileOperations,
  ...dashboardOperations,
  updateUserAvatar: userProfileOperations.updateUserAvatar,
  getUserProfile: userProfileOperations.getUserProfile,
  uploadProductImage: fileOperations.uploadProductImage,
  getProductsByUser: productOperations.getProductsByUser,

  saveSystemSettings: async (settings) => {
    try {
      const settingsRef = doc(db, 'systemSettings', 'general');
      const updatedSettings = { ...settings };

      // Upload images if they exist
      if (settings.logo) {
        updatedSettings.logoUrl = await fileOperations.uploadFile(settings.logo, 'system/logo');
      }
      if (settings.favicon) {
        updatedSettings.faviconUrl = await fileOperations.uploadFile(settings.favicon, 'system/favicon');
      }
      if (settings.banner) {
        updatedSettings.bannerUrl = await fileOperations.uploadFile(settings.banner, 'system/banner');
      }

      // Remove File objects before saving to Firestore
      delete updatedSettings.logo;
      delete updatedSettings.favicon;
      delete updatedSettings.banner;

      await updateDoc(settingsRef, updatedSettings);
    } catch (error) {
      console.error("Erro ao salvar configurações do sistema:", error);
      throw error;
    }
  },

  getSystemSettings: async () => {
    try {
      const settingsRef = doc(db, 'systemSettings', 'general');
      const settingsSnap = await getDoc(settingsRef);
      return settingsSnap.exists() ? settingsSnap.data() : null;
    } catch (error) {
      console.error("Erro ao buscar configurações do sistema:", error);
      throw error;
    }
  },

  saveVissaSiteSettings: async (settings) => {
    try {
      const settingsRef = doc(db, 'vissaSiteSettings', 'general');
      await updateDoc(settingsRef, settings);
    } catch (error) {
      console.error("Erro ao salvar configurações do site Vissa:", error);
      throw error;
    }
  },

  getVissaSiteSettings: async () => {
    try {
      const settingsRef = doc(db, 'vissaSiteSettings', 'general');
      const settingsSnap = await getDoc(settingsRef);
      return settingsSnap.exists() ? settingsSnap.data() : null;
    } catch (error) {
      console.error("Erro ao buscar configurações do site Vissa:", error);
      throw error;
    }
  },
};

export default firebaseOperations;