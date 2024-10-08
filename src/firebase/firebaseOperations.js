import crudOperations from './crudOperations';
import * as userOperations from './userOperations';
import productOperations from './productOperations';
import fileOperations from './fileOperations';
import meusProdutosOperations from './meusProdutosOperations';
import userProfileOperations from './userProfileOperations';
import dashboardOperations from './dashboardOperations';
import { collection, addDoc, updateDoc, doc, increment } from 'firebase/firestore';
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

  adicionarPedidoVendedor: async (userId, pedido) => {
    try {
      const pedidosRef = collection(db, 'users', userId, 'pedidos');
      await addDoc(pedidosRef, pedido);
    } catch (error) {
      console.error("Erro ao adicionar pedido do vendedor:", error);
      throw error;
    }
  },

  adicionarPedidoFornecedor: async (produtoId, pedido) => {
    try {
      const pedidosRef = collection(db, 'pedidosFornecedor');
      await addDoc(pedidosRef, { ...pedido, produtoId });
    } catch (error) {
      console.error("Erro ao adicionar pedido do fornecedor:", error);
      throw error;
    }
  },

  atualizarEstoque: async (produtoId, novoEstoque) => {
    try {
      const produtoRef = doc(db, 'products', produtoId);
      await updateDoc(produtoRef, {
        estoque: novoEstoque,
      });
    } catch (error) {
      console.error("Erro ao atualizar estoque:", error);
      throw error;
    }
  },
};

export default firebaseOperations;
