import { db } from './config';
import { collection, getDocs } from 'firebase/firestore';
import productOperations from './productOperations';

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

export default meusProdutosOperations;