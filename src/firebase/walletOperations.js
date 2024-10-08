import { db } from './config';
import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, runTransaction } from 'firebase/firestore';

const walletOperations = {
  createWallet: async (userId) => {
    const walletRef = collection(db, 'wallets');
    await addDoc(walletRef, {
      userId,
      balance: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  },

  getWalletBalance: async (userId) => {
    const walletRef = collection(db, 'wallets');
    const q = query(walletRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      throw new Error('Wallet not found');
    }
    return querySnapshot.docs[0].data().balance;
  },

  addFunds: async (userId, amount, method) => {
    const walletRef = collection(db, 'wallets');
    const q = query(walletRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      throw new Error('Wallet not found');
    }
    const walletDoc = querySnapshot.docs[0];

    await runTransaction(db, async (transaction) => {
      const walletData = await transaction.get(walletDoc.ref);
      const newBalance = walletData.data().balance + amount;
      transaction.update(walletDoc.ref, { balance: newBalance, updatedAt: new Date().toISOString() });

      // Add transaction to history
      const historyRef = collection(db, 'walletHistory');
      transaction.set(doc(historyRef), {
        userId,
        type: 'credit',
        amount,
        method,
        balance: newBalance,
        createdAt: new Date().toISOString(),
      });
    });
  },

  withdrawFunds: async (userId, amount) => {
    const walletRef = collection(db, 'wallets');
    const q = query(walletRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      throw new Error('Wallet not found');
    }
    const walletDoc = querySnapshot.docs[0];

    await runTransaction(db, async (transaction) => {
      const walletData = await transaction.get(walletDoc.ref);
      if (walletData.data().balance < amount) {
        throw new Error('Insufficient funds');
      }
      const newBalance = walletData.data().balance - amount;
      transaction.update(walletDoc.ref, { balance: newBalance, updatedAt: new Date().toISOString() });

      // Add transaction to history
      const historyRef = collection(db, 'walletHistory');
      transaction.set(doc(historyRef), {
        userId,
        type: 'debit',
        amount,
        method: 'withdrawal',
        balance: newBalance,
        createdAt: new Date().toISOString(),
      });
    });
  },

  payToSupplier: async (buyerId, supplierId, amount, productId) => {
    const buyerWalletRef = collection(db, 'wallets');
    const buyerQ = query(buyerWalletRef, where("userId", "==", buyerId));
    const buyerQuerySnapshot = await getDocs(buyerQ);
    if (buyerQuerySnapshot.empty) {
      throw new Error('Buyer wallet not found');
    }
    const buyerWalletDoc = buyerQuerySnapshot.docs[0];

    const supplierWalletRef = collection(db, 'wallets');
    const supplierQ = query(supplierWalletRef, where("userId", "==", supplierId));
    const supplierQuerySnapshot = await getDocs(supplierQ);
    if (supplierQuerySnapshot.empty) {
      throw new Error('Supplier wallet not found');
    }
    const supplierWalletDoc = supplierQuerySnapshot.docs[0];

    await runTransaction(db, async (transaction) => {
      const buyerWalletData = await transaction.get(buyerWalletDoc.ref);
      if (buyerWalletData.data().balance < amount) {
        throw new Error('Insufficient funds');
      }
      const newBuyerBalance = buyerWalletData.data().balance - amount;
      transaction.update(buyerWalletDoc.ref, { balance: newBuyerBalance, updatedAt: new Date().toISOString() });

      const supplierWalletData = await transaction.get(supplierWalletDoc.ref);
      const newSupplierBalance = supplierWalletData.data().balance + amount;
      transaction.update(supplierWalletDoc.ref, { balance: newSupplierBalance, updatedAt: new Date().toISOString() });

      // Add transactions to history
      const historyRef = collection(db, 'walletHistory');
      transaction.set(doc(historyRef), {
        userId: buyerId,
        type: 'debit',
        amount,
        method: 'product_payment',
        productId,
        balance: newBuyerBalance,
        createdAt: new Date().toISOString(),
      });
      transaction.set(doc(historyRef), {
        userId: supplierId,
        type: 'credit',
        amount,
        method: 'product_sale',
        productId,
        balance: newSupplierBalance,
        createdAt: new Date().toISOString(),
      });
    });
  },

  getWalletHistory: async (userId) => {
    const historyRef = collection(db, 'walletHistory');
    const q = query(historyRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
};

export default walletOperations;