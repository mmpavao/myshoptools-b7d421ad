import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import firebaseOperations from '../../firebase/firebaseOperations';

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (user) {
        try {
          const data = await firebaseOperations.getDashboardData(user.uid);
          setDashboardData(prevData => ({ ...prevData, ...data }));
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
    <Card className="h-32">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
        <Button onClick={handleLogout}>Sair</Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Ganhos" value={`$${dashboardData.faturamento.toFixed(2)}`} icon={DollarSign} />
        <StatCard title="Gastos este mês" value={`$${(dashboardData.faturamento * 0.6).toFixed(2)}`} icon={ShoppingCart} />
        <StatCard title="Vendas" value={`$${(dashboardData.faturamento * 0.8).toFixed(2)}`} icon={TrendingUp} />
        <StatCard title="Saldo" value={`$${(dashboardData.faturamento * 0.4).toFixed(2)}`} icon={DollarSign} />
        <StatCard title="Novas Tarefas" value={dashboardData.tarefas.length} icon={Package} />
        <StatCard title="Projetos Totais" value={dashboardData.totalVendas} icon={Users} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gastos Mensais</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.vendasPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="vendas" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="gastos" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receita Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.receitaSemanal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="receita" fill="#8884d8" />
                <Bar dataKey="despesas" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Tabela de Verificação</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData.checkTable.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.nome}</TableCell>
                    <TableCell>{item.progresso}%</TableCell>
                    <TableCell>{item.quantidade}</TableCell>
                    <TableCell>{item.data}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tráfego Diário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{dashboardData.trafegoDiario.total} Visitantes</div>
            <div className="text-sm text-green-500 mb-4">+{dashboardData.trafegoDiario.crescimento}%</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dashboardData.trafegoDiario.porHora}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hora" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visitantes" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tarefas</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pendentes">
              <TabsList>
                <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
                <TabsTrigger value="concluidas">Concluídas</TabsTrigger>
              </TabsList>
              <TabsContent value="pendentes">
                {dashboardData.tarefas.filter(t => !t.concluida).map((tarefa, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <span>{tarefa.descricao}</span>
                    <Button size="sm">Concluir</Button>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="concluidas">
                {dashboardData.tarefas.filter(t => t.concluida).map((tarefa, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <span className="line-through">{tarefa.descricao}</span>
                    <span className="text-sm text-gray-500">{tarefa.dataConclusao}</span>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.distribuicaoVendas}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dashboardData.distribuicaoVendas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

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
