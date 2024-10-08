import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Truck, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '../Auth/AuthProvider';
import firebaseOperations from '../../firebase/firebaseOperations';
import { formatCurrency } from '../../utils/currencyUtils';
import StatCard from '../Dashboard/StatCard';

const PedidosFornecedor = () => {
  const [filtro, setFiltro] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    aguardando: 0,
    preparando: 0,
    enviados: 0
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPedidos();
    }
  }, [user]);

  const fetchPedidos = async () => {
    // Pedidos fictícios do fornecedor
    const pedidosFicticios = [
      { id: 'PEDF001', sku: 'SKU001', titulo: 'Smartphone XYZ', quantidade: 2, preco: 2599.98, dataCompra: '2024-03-15T10:30:00', statusLogistica: 'Aguardando' },
      { id: 'PEDF002', sku: 'SKU002', titulo: 'Notebook ABC', quantidade: 1, preco: 3499.99, dataCompra: '2024-03-14T14:45:00', statusLogistica: 'Preparando' },
      { id: 'PEDF003', sku: 'SKU003', titulo: 'Smart TV 4K', quantidade: 1, preco: 2199.99, dataCompra: '2024-03-13T09:15:00', statusLogistica: 'Enviado' },
      { id: 'PEDF004', sku: 'SKU004', titulo: 'Fone de Ouvido Bluetooth', quantidade: 3, preco: 899.97, dataCompra: '2024-03-12T16:20:00', statusLogistica: 'Aguardando' },
      { id: 'PEDF005', sku: 'SKU005', titulo: 'Câmera DSLR', quantidade: 1, preco: 1899.99, dataCompra: '2024-03-11T11:00:00', statusLogistica: 'Preparando' },
      { id: 'PEDF006', sku: 'SKU006', titulo: 'Smartwatch', quantidade: 2, preco: 1199.98, dataCompra: '2024-03-10T13:30:00', statusLogistica: 'Enviado' },
      { id: 'PEDF007', sku: 'SKU007', titulo: 'Console de Videogame', quantidade: 1, preco: 2499.99, dataCompra: '2024-03-09T15:45:00', statusLogistica: 'Aguardando' },
      { id: 'PEDF008', sku: 'SKU008', titulo: 'Tablet', quantidade: 2, preco: 1999.98, dataCompra: '2024-03-08T10:10:00', statusLogistica: 'Preparando' },
      { id: 'PEDF009', sku: 'SKU009', titulo: 'Impressora Multifuncional', quantidade: 1, preco: 449.99, dataCompra: '2024-03-07T14:00:00', statusLogistica: 'Enviado' },
      { id: 'PEDF010', sku: 'SKU010', titulo: 'Monitor Ultrawide', quantidade: 1, preco: 1799.99, dataCompra: '2024-03-06T09:30:00', statusLogistica: 'Aguardando' },
    ];

    setPedidos(pedidosFicticios);
    calculateStats(pedidosFicticios);
  };

  const calculateStats = (pedidosData) => {
    const newStats = {
      total: pedidosData.length,
      aguardando: pedidosData.filter(p => p.statusLogistica === 'Aguardando').length,
      preparando: pedidosData.filter(p => p.statusLogistica === 'Preparando').length,
      enviados: pedidosData.filter(p => ['Enviado', 'Entregue'].includes(p.statusLogistica)).length
    };
    setStats(newStats);
  };

  const pedidosFiltrados = pedidos.filter(pedido =>
    pedido.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
    pedido.sku.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pedidos do Fornecedor</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total de Pedidos" value={stats.total} icon={Package} />
        <StatCard title="Aguardando" value={stats.aguardando} icon={Clock} />
        <StatCard title="Em Preparação" value={stats.preparando} icon={Truck} />
        <StatCard title="Enviados" value={stats.enviados} icon={CheckCircle} />
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
              <TabsTrigger value="aguardando">Pedidos Aguardando</TabsTrigger>
              <TabsTrigger value="preparando">Pedidos em Preparação</TabsTrigger>
            </TabsList>
            <TabsContent value="todos">
              <PedidosTable pedidos={pedidosFiltrados} />
            </TabsContent>
            <TabsContent value="aguardando">
              <PedidosTable pedidos={pedidosFiltrados.filter(p => p.statusLogistica === 'Aguardando')} />
            </TabsContent>
            <TabsContent value="preparando">
              <PedidosTable pedidos={pedidosFiltrados.filter(p => p.statusLogistica === 'Preparando')} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const PedidosTable = ({ pedidos }) => {
  const statusLogisticaOptions = [
    'Aguardando', 'Preparando', 'Pronto para envio', 'Enviado', 'Entregue', 'Cancelado'
  ];

  const handleStatusChange = async (pedidoId, novoStatus) => {
    try {
      await firebaseOperations.atualizarStatusPedidoFornecedor(pedidoId, novoStatus);
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]"><Checkbox /></TableHead>
          <TableHead>ID</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Produto</TableHead>
          <TableHead>Quantidade</TableHead>
          <TableHead>Valor Total</TableHead>
          <TableHead>Data da Compra</TableHead>
          <TableHead>Status Logística</TableHead>
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
            <TableCell>{pedido.quantidade}</TableCell>
            <TableCell>{formatCurrency(pedido.preco)}</TableCell>
            <TableCell>{new Date(pedido.dataCompra).toLocaleString()}</TableCell>
            <TableCell>
              <Select 
                defaultValue={pedido.statusLogistica} 
                onValueChange={(value) => handleStatusChange(pedido.id, value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status Logística" />
                </SelectTrigger>
                <SelectContent>
                  {statusLogisticaOptions.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="space-x-2">
              <Button variant="outline" size="icon"><Eye className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon"><Truck className="h-4 w-4" /></Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PedidosFornecedor;