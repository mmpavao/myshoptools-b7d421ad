import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import firebaseOperations from '../../firebase/firebaseOperations';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    totalVendas: 0,
    produtosVendidos: 0,
    faturamento: 0,
    crescimento: 0,
    vendasPorMes: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (user) {
        try {
          const data = await firebaseOperations.getDashboardData(user.uid);
          setDashboardData(data);
        } catch (error) {
          console.error("Erro ao buscar dados do dashboard:", error);
        }
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleLogout = async () => {
    await logout();
  };

  const StatCard = ({ title, value, icon: Icon }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
        <Button onClick={handleLogout}>Sair</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total de Vendas" value={dashboardData.totalVendas} icon={ShoppingCart} />
        <StatCard title="Produtos Vendidos" value={dashboardData.produtosVendidos} icon={Package} />
        <StatCard title="Faturamento" value={`R$ ${dashboardData.faturamento.toFixed(2)}`} icon={DollarSign} />
        <StatCard title="Crescimento" value={`${dashboardData.crescimento}%`} icon={TrendingUp} />
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Vendas por Mês</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={dashboardData.vendasPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="vendas" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2"><strong>Email:</strong> {user?.email}</p>
          <p className="mb-2"><strong>ID:</strong> {user?.uid}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;