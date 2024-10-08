import { db } from './config';
import { collection, addDoc, getDoc, updateDoc, deleteDoc, doc, getDocs, setDoc, query, where } from 'firebase/firestore';

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
  deleteProduct: (productId) => deleteDoc(doc(db, 'products', productId)),
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
  getProductsByUser: async (userId) => {
    const q = query(collection(db, 'products'), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  getAllProductsWithUsers: async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const products = [];
    for (const doc of querySnapshot.docs) {
      const productData = doc.data();
      const userDoc = await getDoc(doc(db, 'users', productData.userId));
      const userData = userDoc.data();
      products.push({
        id: doc.id,
        ...productData,
        userName: userData?.displayName || 'Usuário Desconhecido',
      });
    }
    return products;
  },
};

export default productOperations;
