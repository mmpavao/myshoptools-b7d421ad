import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { Button } from '../ui/button';
import { DollarSign, ShoppingCart, TrendingUp, Package, Users } from 'lucide-react';
import firebaseOperations from '../../firebase/firebaseOperations';
import StatCard from './StatCard';
import SalesChart from './SalesChart';
import RevenueChart from './RevenueChart';
import CheckTable from './CheckTable';
import DailyTraffic from './DailyTraffic';
import TaskList from './TaskList';
import SalesDistribution from './SalesDistribution';
import UserInfo from './UserInfo';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { formatCurrency } from '../../utils/currencyUtils';
import { toast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    totalVendas: 0,
    produtosVendidos: 0,
    faturamento: 0,
    crescimento: 0,
    vendasPorMes: [],
    receitaSemanal: [],
    trafegoDiario: { total: 0, crescimento: 0, porHora: [] },
    tarefas: [],
    checkTable: [],
    distribuicaoVendas: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (user) {
        try {
          setLoading(true);
          setError(null);
          console.log("Fetching dashboard data for user:", user.uid);
          const data = await firebaseOperations.getDashboardData(user.uid);
          console.log("Received dashboard data:", data);
          setDashboardData(prevData => ({ ...prevData, ...data }));
        } catch (error) {
          console.error("Erro ao buscar dados do dashboard:", error);
          setError("Falha ao carregar os dados do dashboard. Por favor, tente novamente.");
          toast({
            title: "Erro",
            description: "Não foi possível carregar os dados do dashboard.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return <div>Carregando dados do dashboard...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (!user) {
    return <div>Usuário não autenticado. Por favor, faça login.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
        <Button onClick={handleLogout}>Sair</Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard title="Ganhos" value={formatCurrency(dashboardData.faturamento)} icon={DollarSign} />
        <StatCard title="Gastos este mês" value={formatCurrency(dashboardData.faturamento * 0.6)} icon={ShoppingCart} />
        <StatCard title="Vendas" value={formatCurrency(dashboardData.faturamento * 0.8)} icon={TrendingUp} />
        <StatCard title="Saldo" value={formatCurrency(dashboardData.faturamento * 0.4)} icon={DollarSign} />
        <StatCard title="Novas Tarefas" value={dashboardData.tarefas.length} icon={Package} />
        <StatCard title="Projetos Totais" value={dashboardData.totalVendas} icon={Users} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SalesChart data={dashboardData.vendasPorMes} />
        <RevenueChart data={dashboardData.receitaSemanal} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Canais de Venda</CardTitle>
          </CardHeader>
          <CardContent>
            <CheckTable data={dashboardData.checkTable} />
          </CardContent>
        </Card>

        <DailyTraffic data={dashboardData.trafegoDiario} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TaskList tasks={dashboardData.tarefas} />
        <SalesDistribution data={dashboardData.distribuicaoVendas} />
      </div>

      <UserInfo user={user} />
    </div>
  );
};

export default Dashboard;
