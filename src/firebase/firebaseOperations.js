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
      if (profileData.displayName || profileData.photoURL) {
        await auth.currentUser.updateProfile({
          displayName: profileData.displayName,
          photoURL: profileData.photoURL
        });
      }
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
  uploadAvatar: async (file, userId) => {
    if (!file || !userId) {
      throw new Error('Invalid file or user ID');
    }
    const fileExtension = file.name.split('.').pop();
    const path = `avatars/${userId}_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, path);
    
    try {
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      await new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          },
          (error) => {
            console.error('Upload error:', error);
            reject(error);
          },
          () => {
            resolve();
          }
        );
      });

      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      await userProfileOperations.updateUserProfile(userId, { photoURL: downloadURL });
      return downloadURL;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  }
};

const dashboardOperations = {
  getDashboardData: async (userId) => {
    try {
      return {
        totalVendas: 150,
        produtosVendidos: 300,
        faturamento: 15000.00,
        crescimento: 5.7,
        vendasPorMes: [
          { mes: 'Jan', vendas: 65, gastos: 45 },
          { mes: 'Fev', vendas: 59, gastos: 40 },
          { mes: 'Mar', vendas: 80, gastos: 55 },
          { mes: 'Abr', vendas: 81, gastos: 60 },
          { mes: 'Mai', vendas: 56, gastos: 45 },
          { mes: 'Jun', vendas: 55, gastos: 40 },
        ],
        receitaSemanal: [
          { dia: '17', receita: 1000, despesas: 700 },
          { dia: '18', receita: 1200, despesas: 800 },
          { dia: '19', receita: 900, despesas: 600 },
          { dia: '20', receita: 1500, despesas: 1000 },
          { dia: '21', receita: 1100, despesas: 700 },
          { dia: '22', receita: 1300, despesas: 900 },
          { dia: '23', receita: 1400, despesas: 950 },
        ],
        trafegoDiario: {
          total: 2579,
          crescimento: 2.45,
          porHora: [
            { hora: '00', visitantes: 120 },
            { hora: '04', visitantes: 80 },
            { hora: '08', visitantes: 300 },
            { hora: '12', visitantes: 450 },
            { hora: '16', visitantes: 280 },
            { hora: '20', visitantes: 190 },
          ]
        },
        tarefas: [
          { descricao: 'Design da Landing Page', concluida: false },
          { descricao: 'Implementar API', concluida: true, dataConclusao: '2023-03-15' },
          { descricao: 'Testar nova funcionalidade', concluida: false },
          { descricao: 'Reunião com cliente', concluida: false },
          { descricao: 'Atualizar documentação', concluida: true, dataConclusao: '2023-03-10' },
        ],
        checkTable: [
          { nome: 'Marketplace', progresso: 75.5, quantidade: 2458, data: 'Apr 26, 2022' },
          { nome: 'Venus DB PRO', progresso: 35.4, quantidade: 1485, data: 'Jul 20, 2022' },
          { nome: 'Venus DS', progresso: 25, quantidade: 1024, data: 'Sep 30, 2022' },
          { nome: 'Venus 3D Asset', progresso: 100, quantidade: 858, data: 'Oct 24, 2022' },
        ],
        distribuicaoVendas: [
          { name: 'Produto A', value: 400 },
          { name: 'Produto B', value: 300 },
          { name: 'Produto C', value: 200 },
          { name: 'Outros', value: 100 },
        ],
      };
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
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
  ...dashboardOperations,
};

export default firebaseOperations;
