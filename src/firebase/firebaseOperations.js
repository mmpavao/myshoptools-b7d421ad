import crudOperations from './crudOperations';
import * as userOperations from './userOperations';
import productOperations from './productOperations';
import fileOperations from './fileOperations';
import meusProdutosOperations from './meusProdutosOperations';
import userProfileOperations from './userProfileOperations';
import dashboardOperations from './dashboardOperations';
import { collection, addDoc, updateDoc, doc, increment, getDocs, query, where } from 'firebase/firestore';
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


  gerarPedidosFicticios: async (userId, fornecedorId) => {
    try {
      const produtos = await productOperations.getProducts();
      const pedidos = [];

      for (let i = 0; i < 50; i++) {
        const produto = produtos[i % produtos.length];
        const pedido = {
          produtoId: produto.id,
          titulo: produto.titulo,
          preco: produto.preco,
          quantidade: Math.floor(Math.random() * 5) + 1,
          status: ['Novo', 'Processando', 'Enviado'][Math.floor(Math.random() * 3)],
          dataCompra: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          sku: produto.sku,
          fornecedorId: fornecedorId,
        };

        // Adicionar pedido para o vendedor
        const pedidoVendedorRef = await addDoc(collection(db, 'users', userId, 'pedidos'), {
          ...pedido,
          statusVendedor: pedido.status,
          dataAtualizacao: new Date().toISOString(),
        });

        // Adicionar pedido para o fornecedor
        const pedidoFornecedorRef = await addDoc(collection(db, 'pedidosFornecedor'), {
          ...pedido,
          statusLogistica: ['Aguardando', 'Preparando', 'Pronto para envio', 'Enviado'][Math.floor(Math.random() * 4)],
          dataAtualizacao: new Date().toISOString(),
        });

        pedidos.push({
          vendedorId: pedidoVendedorRef.id,
          fornecedorId: pedidoFornecedorRef.id,
        });
      }

      return pedidos;
    } catch (error) {
      console.error("Erro ao gerar pedidos fictícios:", error);
      throw error;
    }
  },

  adicionarPedidoVendedor: async (userId, pedido) => {
    try {
      const pedidosRef = collection(db, 'users', userId, 'pedidos');
      await addDoc(pedidosRef, {
        ...pedido,
        statusVendedor: 'Novo',
        dataAtualizacao: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erro ao adicionar pedido do vendedor:", error);
      throw error;
    }
  },

  adicionarPedidoFornecedor: async (fornecedorId, pedido) => {
    try {
      const pedidosRef = collection(db, 'pedidosFornecedor');
      await addDoc(pedidosRef, {
        ...pedido,
        fornecedorId,
        statusLogistica: 'Aguardando',
        dataAtualizacao: new Date().toISOString(),
      });
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

  getPedidosVendedor: async (userId) => {
    try {
      const pedidosRef = collection(db, 'users', userId, 'pedidos');
      const snapshot = await getDocs(pedidosRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Erro ao buscar pedidos do vendedor:", error);
      throw error;
    }
  },

  getPedidosFornecedor: async (fornecedorId) => {
    try {
      const pedidosRef = collection(db, 'pedidosFornecedor');
      const q = query(pedidosRef, where("fornecedorId", "==", fornecedorId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Erro ao buscar pedidos do fornecedor:", error);
      throw error;
    }
  },

  atualizarStatusPedidoVendedor: async (userId, pedidoId, novoStatus) => {
    try {
      const pedidoRef = doc(db, 'users', userId, 'pedidos', pedidoId);
      await updateDoc(pedidoRef, {
        statusVendedor: novoStatus,
        dataAtualizacao: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erro ao atualizar status do pedido do vendedor:", error);
      throw error;
    }
  },

  atualizarStatusPedidoFornecedor: async (pedidoId, novoStatus) => {
    try {
      const pedidoRef = doc(db, 'pedidosFornecedor', pedidoId);
      await updateDoc(pedidoRef, {
        statusLogistica: novoStatus,
        dataAtualizacao: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erro ao atualizar status do pedido do fornecedor:", error);
      throw error;
    }
  },
};

export default firebaseOperations;
