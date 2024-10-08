import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Truck, Package, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '../Auth/AuthProvider';
import firebaseOperations from '../../firebase/firebaseOperations';
import { formatCurrency } from '../../utils/currencyUtils';
import { useToast } from "@/components/ui/use-toast";
import StatCard from '../Dashboard/StatCard'; // Add this import

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
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchPedidos();
    }
  }, [user]);

  const fetchPedidos = async () => {
    try {
      const fetchedPedidos = await firebaseOperations.getPedidosFornecedor(user.uid);
      setPedidos(fetchedPedidos);
      updateStats(fetchedPedidos);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os pedidos.",
        variant: "destructive",
      });
    }
  };

  const updateStats = (pedidosList) => {
    const newStats = {
      total: pedidosList.length,
      aguardando: pedidosList.filter(p => p.statusLogistica === 'Aguardando').length,
      preparando: pedidosList.filter(p => p.statusLogistica === 'Preparando').length,
      enviados: pedidosList.filter(p => p.statusLogistica === 'Enviado').length
    };
    setStats(newStats);
  };

  const gerarPedidosFicticios = async () => {
    try {
      await firebaseOperations.gerarPedidosFicticios(user.uid, user.uid);
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

  const pedidosFiltrados = pedidos.filter(pedido =>
    pedido.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
    pedido.sku.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pedidos do Fornecedor</h1>
        <Button onClick={gerarPedidosFicticios}>
          <Plus className="mr-2 h-4 w-4" />
          Gerar 50 Pedidos Fictícios
        </Button>
      </div>
      
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