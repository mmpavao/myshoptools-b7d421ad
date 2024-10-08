import { db, storage, auth } from './config';
import { collection, addDoc, getDoc, updateDoc, deleteDoc, doc, getDocs, setDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { toast } from '@/components/ui/use-toast';
import { updateProfile } from 'firebase/auth';
import * as userOperations from './userOperations';

const firebaseOperations = {
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
  adicionarAvaliacao: async (produtoId, userId, nota, comentario) => {
    try {
      const produtoRef = doc(db, 'products', produtoId);
      const produtoDoc = await getDoc(produtoRef);
      const userDoc = await getDoc(doc(db, 'users', userId));

      if (!produtoDoc.exists()) {
        throw new Error('Produto não encontrado');
      }

      const produtoData = produtoDoc.data();
      const avaliacoes = produtoData.avaliacoes || [];
      const userName = userDoc.exists() ? userDoc.data().displayName || 'Usuário' : 'Usuário';
      const abreviatedName = userName.split(' ')[0] + (userName.split(' ')[1] ? ` ${userName.split(' ')[1][0]}.` : '');

      const novaAvaliacao = {
        userId,
        userName: abreviatedName,
        nota,
        comentario,
        data: new Date().toISOString()
      };

      avaliacoes.push(novaAvaliacao);

      const numeroAvaliacoes = avaliacoes.length;
      const somaNotas = avaliacoes.reduce((sum, av) => sum + av.nota, 0);
      const mediaAvaliacoes = somaNotas / numeroAvaliacoes;

      await updateDoc(produtoRef, {
        avaliacoes,
        avaliacao: mediaAvaliacoes,
        numeroAvaliacoes
      });

      return true;
    } catch (error) {
      console.error('Erro ao adicionar avaliação:', error);
      throw error;
    }
  },
  importarProduto: async (userId, produto) => {
    const userProductRef = doc(db, 'users', userId, 'produtosImportados', produto.id);
    await setDoc(userProductRef, produto);
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
  getUserById: async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return { 
          id: userDoc.id, 
          ...userData,
          displayName: userData.displayName || 'Nome não disponível',
          email: userData.email || 'Email não disponível',
          photoURL: userData.photoURL || '/placeholder.svg', // Use a local placeholder
          role: userData.role || 'Usuário',
          status: userData.status || 'Inativo',
          phoneNumber: userData.phoneNumber || '',
          address: userData.address || '',
        };
      } else {
        throw new Error('Usuário não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  },

  uploadProfileImage: async (userId, blob, fileName) => {
    const path = `avatars/${userId}/${Date.now()}_${fileName}`;
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Error in upload:', error);
          reject(new Error(`Upload failed: ${error.message}`));
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error('Error getting download URL:', error);
            reject(new Error(`Failed to get download URL: ${error.message}`));
          }
        }
      );
    });
  },

  getAllUsers: userOperations.getAllUsers,
  getUserRole: userOperations.getUserRole,

  updateUserProfile: async (userId, profileData) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, profileData);
      
      if (auth.currentUser && auth.currentUser.uid === userId) {
        const updateData = {};
        if (profileData.displayName) updateData.displayName = profileData.displayName;
        if (profileData.photoURL) updateData.photoURL = profileData.photoURL;
        
        if (Object.keys(updateData).length > 0) {
          await updateProfile(auth.currentUser, updateData);
        }
      }
      
      if (profileData.role) {
        await userOperations.updateUserRole(userId, profileData.role);
      }
      if (profileData.status) {
        await userOperations.updateUserStatus(userId, profileData.status);
      }
      
      console.log('Perfil do usuário atualizado com sucesso:', profileData);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil do usuário:', error);
      throw error;
    }
  },
};

export default firebaseOperations;
