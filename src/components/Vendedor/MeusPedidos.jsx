import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, CreditCard, Package, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import { useAuth } from '../Auth/AuthProvider';
import firebaseOperations from '../../firebase/firebaseOperations';
import { formatCurrency } from '../../utils/currencyUtils';
import { useToast } from "@/components/ui/use-toast";
import StatCard from '../Dashboard/StatCard'; // Add this import

const MeusPedidos = () => {
  const [filtro, setFiltro] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    novos: 0,
    processando: 0,
    enviados: 0
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPedidos();
    }
  }, [user]);

  const { toast } = useToast();

  const gerarPedidosFicticios = async () => {
    try {
      await firebaseOperations.gerarPedidosFicticios(user.uid, user.uid); // Assumindo que o fornecedorId é o mesmo que o userId
      toast({
        title: "Pedidos gerados",
        description: "50 pedidos fictícios foram gerados com sucesso.",
        variant: "success",
      });
      fetchPedidos();
    } catch (error) {
      console.error("Erro ao gerar pedidos fictícios:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar os pedidos fictícios.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Meus Pedidos</h1>
        <Button onClick={gerarPedidosFicticios}>
          <Plus className="mr-2 h-4 w-4" />
          Gerar 50 Pedidos Fictícios
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total de Pedidos" value={stats.total} icon={Package} />
        <StatCard title="Novos Pedidos" value={stats.novos} icon={Clock} />
        <StatCard title="Pedidos em Processamento" value={stats.processando} icon={Package} />
        <StatCard title="Pedidos Enviados" value={stats.enviados} icon={CheckCircle} />
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Input
              placeholder="Filtrar por produto ou SKU"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Tabs defaultValue="todos">
            <TabsList className="mb-4">
              <TabsTrigger value="todos">Todos os Pedidos</TabsTrigger>
              <TabsTrigger value="novos">Novos Pedidos</TabsTrigger>
              <TabsTrigger value="processando">Em Processamento</TabsTrigger>
              <TabsTrigger value="enviados">Enviados</TabsTrigger>
            </TabsList>
            <TabsContent value="todos">
              <PedidosTable pedidos={pedidosFiltrados} />
            </TabsContent>
            <TabsContent value="novos">
              <PedidosTable pedidos={pedidosFiltrados.filter(p => p.statusVendedor === 'Novo')} />
            </TabsContent>
            <TabsContent value="processando">
              <PedidosTable pedidos={pedidosFiltrados.filter(p => p.statusVendedor === 'Processando')} />
            </TabsContent>
            <TabsContent value="enviados">
              <PedidosTable pedidos={pedidosFiltrados.filter(p => p.statusVendedor === 'Enviado')} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const PedidosTable = ({ pedidos }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[50px]"><Checkbox /></TableHead>
        <TableHead>ID</TableHead>
        <TableHead>SKU</TableHead>
        <TableHead>Produto</TableHead>
        <TableHead>Preço de Venda</TableHead>
        <TableHead>Data da Compra</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Ações</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {pedidos.map((pedido) => (
        <TableRow key={pedido.id}>
          <TableCell><Checkbox /></TableCell>
          <TableCell>{pedido.id}</TableCell>
          <TableCell>{pedido.sku}</TableCell>
          <TableCell>{pedido.titulo}</TableCell>
          <TableCell>{formatCurrency(pedido.preco)}</TableCell>
          <TableCell>{new Date(pedido.dataCompra).toLocaleString()}</TableCell>
          <TableCell>{pedido.statusVendedor}</TableCell>
          <TableCell className="space-x-2">
            <Button variant="outline" size="icon"><Eye className="h-4 w-4" /></Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default MeusPedidos;