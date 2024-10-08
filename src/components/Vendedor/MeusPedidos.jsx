import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, CreditCard } from 'lucide-react';

const MeusPedidos = () => {
  const [filtro, setFiltro] = useState('');
  // Simulação de pedidos
  const pedidos = [
    { id: 1, plataforma: 'Mercado Livre', produto: 'Produto 1', precoVenda: 150, precoFornecedor: 100, status: 'Pendente' },
    { id: 2, plataforma: 'Amazon', produto: 'Produto 2', precoVenda: 300, precoFornecedor: 200, status: 'Pago' },
    // Adicione mais pedidos conforme necessário
  ];

  const pedidosFiltrados = pedidos.filter(pedido =>
    pedido.produto.toLowerCase().includes(filtro.toLowerCase()) ||
    pedido.plataforma.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Meus Pedidos</h1>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Input
              placeholder="Filtrar por produto ou plataforma"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="max-w-sm"
            />
            <Button>Novo Pedido</Button>
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
        <TableHead>Plataforma</TableHead>
        <TableHead>Produto</TableHead>
        <TableHead>Preço de Venda</TableHead>
        <TableHead>Preço Fornecedor</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Ações</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {pedidos.map((pedido) => (
        <TableRow key={pedido.id}>
          <TableCell><Checkbox /></TableCell>
          <TableCell>{pedido.id}</TableCell>
          <TableCell>{pedido.plataforma}</TableCell>
          <TableCell>{pedido.produto}</TableCell>
          <TableCell>R$ {pedido.precoVenda}</TableCell>
          <TableCell>R$ {pedido.precoFornecedor}</TableCell>
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