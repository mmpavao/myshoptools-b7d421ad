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
          { nome: 'Mercado Livre', progresso: 75.5, quantidade: 2458, data: 'Apr 26, 2023' },
          { nome: 'MyShop', progresso: 60.4, quantidade: 1985, data: 'Jul 20, 2023' },
          { nome: 'Shopee', progresso: 45.2, quantidade: 1524, data: 'Sep 30, 2023' },
          { nome: 'Amazon', progresso: 35.8, quantidade: 1158, data: 'Oct 24, 2023' },
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

export default dashboardOperations;
