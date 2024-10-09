import crudOperations from './crudOperations';
import * as userOperations from './userOperations';
import productOperations from './productOperations';
import fileOperations from './fileOperations';
import meusProdutosOperations from './meusProdutosOperations';
import userProfileOperations from './userProfileOperations';
import dashboardOperations from './dashboardOperations';
import { collection, addDoc, updateDoc, doc, increment, getDocs, query, where, getDoc, setDoc } from 'firebase/firestore';
import { db, functions } from './config';
import { httpsCallable } from 'firebase/functions';

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

  getStripeKeys: async (userId) => {
    const docRef = doc(db, 'stripeIntegration', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  },

  saveStripeKeys: async (userId, keys) => {
    const docRef = doc(db, 'stripeIntegration', userId);
    await setDoc(docRef, keys, { merge: true });
  },

  testStripeConnection: async (userId) => {
    const testConnection = httpsCallable(functions, 'testStripeConnection');
    return testConnection({ userId });
  },

  processStripePayment: async (userId, amount, installments) => {
    const processPayment = httpsCallable(functions, 'processStripePayment');
    return processPayment({ userId, amount, installments });
  },

  processPixPayment: async (userId, amount) => {
    const processPixPayment = httpsCallable(functions, 'processPixPayment');
    return processPixPayment({ userId, amount });
  },
};

export default firebaseOperations;
