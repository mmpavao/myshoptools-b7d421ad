import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Package, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../Auth/AuthProvider';
import { formatCurrency } from '../../utils/currencyUtils';
import StatCard from './StatCard';
import walletOperations from '../../firebase/walletOperations';
import { toast } from "@/components/ui/use-toast";

const MeusPedidos = () => {
  const [filtro, setFiltro] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [stats, setStats] = useState({ total: 0, novos: 0, processando: 0, enviados: 0 });
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchPedidos();
  }, [user]);

  const handlePay = async (pedido) => {
    try {
      await walletOperations.payToSupplier(user.uid, pedido.fornecedorId, pedido.preco, pedido.id);
      toast({
        title: "Pagamento realizado",
        description: `Pagamento de ${formatCurrency(pedido.preco)} para o pedido ${pedido.id} foi realizado com sucesso.`,
      });
      fetchPedidos(); // Atualiza a lista de pedidos
    } catch (error) {
      console.error("Erro ao realizar pagamento:", error);
      toast({
        title: "Erro no pagamento",
        description: "Não foi possível realizar o pagamento. Verifique seu saldo e tente novamente.",
        variant: "destructive",
      });
    }
  };

  const fetchPedidos = async () => {
    // Simulação de pedidos (substitua por chamada real à API/Firebase)
    const pedidosFicticios = [
      { id: 'PED001', sku: 'SKU001', titulo: 'Smartphone XYZ', preco: 1299.99, dataCompra: '2024-03-15T10:30:00', statusVendedor: 'Novo', statusPagamento: 'Pendente' },
      { id: 'PED002', sku: 'SKU002', titulo: 'Notebook ABC', preco: 3499.99, dataCompra: '2024-03-14T14:45:00', statusVendedor: 'Processando', statusPagamento: 'Pago' },
      { id: 'PED003', sku: 'SKU003', titulo: 'Smart TV 4K', preco: 2199.99, dataCompra: '2024-03-13T09:15:00', statusVendedor: 'Enviado', statusPagamento: 'Pago' },
      { id: 'PED004', sku: 'SKU004', titulo: 'Fone de Ouvido Bluetooth', preco: 299.99, dataCompra: '2024-03-12T16:20:00', statusVendedor: 'Novo', statusPagamento: 'Pendente' },
      { id: 'PED005', sku: 'SKU005', titulo: 'Câmera DSLR', preco: 1899.99, dataCompra: '2024-03-11T11:00:00', statusVendedor: 'Processando', statusPagamento: 'Pago' },
      { id: 'PED006', sku: 'SKU006', titulo: 'Smartwatch', preco: 599.99, dataCompra: '2024-03-10T13:30:00', statusVendedor: 'Enviado', statusPagamento: 'Pago' },
      { id: 'PED007', sku: 'SKU007', titulo: 'Console de Videogame', preco: 2499.99, dataCompra: '2024-03-09T15:45:00', statusVendedor: 'Novo', statusPagamento: 'Pendente' },
      { id: 'PED008', sku: 'SKU008', titulo: 'Tablet', preco: 999.99, dataCompra: '2024-03-08T10:10:00', statusVendedor: 'Processando', statusPagamento: 'Pendente' },
      { id: 'PED009', sku: 'SKU009', titulo: 'Impressora Multifuncional', preco: 449.99, dataCompra: '2024-03-07T14:00:00', statusVendedor: 'Enviado', statusPagamento: 'Pago' },
      { id: 'PED010', sku: 'SKU010', titulo: 'Monitor Ultrawide', preco: 1799.99, dataCompra: '2024-03-06T09:30:00', statusVendedor: 'Novo', statusPagamento: 'Pendente' },
    ];

    setPedidos(pedidosFicticios);
    calculateStats(pedidosFicticios);
  };

  const calculateStats = (pedidosData) => {
    setStats({
      total: pedidosData.length,
      novos: pedidosData.filter(p => p.statusVendedor === 'Novo').length,
      processando: pedidosData.filter(p => p.statusVendedor === 'Processando').length,
      enviados: pedidosData.filter(p => p.statusVendedor === 'Enviado').length
    });
  };

  const pedidosFiltrados = pedidos.filter(pedido =>
    pedido.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
    pedido.sku.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Meus Pedidos</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total de Pedidos" value={stats.total} icon={Package} />
        <StatCard title="Novos Pedidos" value={stats.novos} icon={Clock} />
        <StatCard title="Pedidos em Processamento" value={stats.processando} icon={Package} />
        <StatCard title="Pedidos Enviados" value={stats.enviados} icon={CheckCircle} />
      </div>
      
      <Card>
        <CardContent className="p-6">
          <Input
            placeholder="Filtrar por produto ou SKU"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="max-w-sm mb-6"
          />

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

const PedidosTable = ({ pedidos }) => {
  const handlePay = async (pedido) => {
    try {
      await walletOperations.payToSupplier(pedido.userId, pedido.fornecedorId, pedido.preco, pedido.id);
      toast({
        title: "Pagamento realizado",
        description: `Pagamento de ${formatCurrency(pedido.preco)} para o pedido ${pedido.id} foi realizado com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao realizar pagamento:", error);
      toast({
        title: "Erro no pagamento",
        description: "Não foi possível realizar o pagamento. Verifique seu saldo e tente novamente.",
        variant: "destructive",
      });
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
          <TableHead>Preço de Venda</TableHead>
          <TableHead>Data da Compra</TableHead>
          <TableHead>Status do Pedido</TableHead>
          <TableHead>Pagamento</TableHead>
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
            <TableCell>
              {pedido.statusPagamento === 'Pendente' ? (
                <Button variant="default" size="sm" onClick={() => handlePay(pedido)}>
                  Pagar
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  Pago
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MeusPedidos;
