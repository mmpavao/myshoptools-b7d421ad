import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, CreditCard } from 'lucide-react';
import { useAuth } from '../Auth/AuthProvider';
import firebaseOperations from '../../firebase/firebaseOperations';
import { formatCurrency } from '../../utils/currencyUtils';

const MeusPedidos = () => {
  const [filtro, setFiltro] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPedidos();
    }
  }, [user]);

  const fetchPedidos = async () => {
    try {
      const pedidosData = await firebaseOperations.getPedidosVendedor(user.uid);
      setPedidos(pedidosData);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  };

  const pedidosFiltrados = pedidos.filter(pedido =>
    pedido.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
    pedido.sku.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Meus Pedidos</h1>
      
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
              <TabsTrigger value="pendentes">Pedidos Pendentes</TabsTrigger>
              <TabsTrigger value="pagos">Pedidos Pagos</TabsTrigger>
            </TabsList>
            <TabsContent value="todos">
              <PedidosTable pedidos={pedidosFiltrados} />
            </TabsContent>
            <TabsContent value="pendentes">
              <PedidosTable pedidos={pedidosFiltrados.filter(p => p.status === 'Pendente')} />
            </TabsContent>
            <TabsContent value="pagos">
              <PedidosTable pedidos={pedidosFiltrados.filter(p => p.status === 'Pago')} />
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
          <TableCell>{pedido.status}</TableCell>
          <TableCell className="space-x-2">
            <Button variant="outline" size="icon"><Eye className="h-4 w-4" /></Button>
            <Button 
              variant="outline" 
              size="icon" 
              disabled={pedido.status === 'Pago'}
            >
              <CreditCard className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default MeusPedidos;