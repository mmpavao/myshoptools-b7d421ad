import { db } from './config';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';

const dashboardOperations = {
  getDashboardData: async (userId) => {
    console.log("Getting dashboard data for user:", userId);
    try {
      // Aqui, vamos tentar buscar alguns dados reais do Firestore
      const vendas = await getDocs(query(collection(db, 'vendas'), where('userId', '==', userId), limit(10)));
      const produtos = await getDocs(query(collection(db, 'produtos'), where('userId', '==', userId), limit(10)));

      console.log("Vendas encontradas:", vendas.size);
      console.log("Produtos encontrados:", produtos.size);

      // Se não houver dados reais, usaremos dados simulados
      if (vendas.empty && produtos.empty) {
        console.log("Nenhum dado real encontrado. Usando dados simulados.");
        return {
          totalVendas: 0,
          produtosVendidos: 0,
          faturamento: 0,
          crescimento: 0,
          vendasPorMes: [],
          receitaSemanal: [],
          trafegoDiario: { total: 0, crescimento: 0, porHora: [] },
          tarefas: [],
          checkTable: [],
          distribuicaoVendas: [],
        };
      }

      // Aqui você pode processar os dados reais e retorná-los
      // Por enquanto, vamos retornar alguns dados baseados no que encontramos
      return {
        totalVendas: vendas.size,
        produtosVendidos: produtos.size,
        faturamento: vendas.docs.reduce((acc, doc) => acc + (doc.data().valor || 0), 0),
        crescimento: 0,
        vendasPorMes: [],
        receitaSemanal: [],
        trafegoDiario: { total: vendas.size, crescimento: 0, porHora: [] },
        tarefas: [],
        checkTable: [],
        distribuicaoVendas: [],
      };
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      throw error;
    }
  },
};

export default dashboardOperations;