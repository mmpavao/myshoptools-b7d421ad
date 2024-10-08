import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Truck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PedidosFornecedor = () => {
  const [filtro, setFiltro] = useState('');
  // Simulação de pedidos do fornecedor
  const pedidos = [
    { id: 1, produto: 'Produto 1', quantidade: 2, valorTotal: 200, statusPagamento: 'Pago', statusLogistica: 'Preparando' },
    { id: 2, produto: 'Produto 2', quantidade: 1, valorTotal: 300, statusPagamento: 'Pendente', statusLogistica: 'Aguardando' },
    // Adicione mais pedidos conforme necessário
  ];

  const pedidosFiltrados = pedidos.filter(pedido =>
    pedido.produto.toLowerCase().includes(filtro.toLowerCase()) ||
    pedido.statusLogistica.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pedidos do Fornecedor</h1>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Input
              placeholder="Filtrar por produto ou status"
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
              <TabsTrigger value="preparando">Pedidos em Preparação</TabsTrigger>
            </TabsList>
            <TabsContent value="todos">
              <PedidosTable pedidos={pedidosFiltrados} />
            </TabsContent>
            <TabsContent value="pendentes">
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]"><Checkbox /></TableHead>
          <TableHead>ID</TableHead>
          <TableHead>Produto</TableHead>
          <TableHead>Quantidade</TableHead>
          <TableHead>Valor Total</TableHead>
          <TableHead>Status Pagamento</TableHead>
          <TableHead>Status Logística</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pedidos.map((pedido) => (
          <TableRow key={pedido.id}>
            <TableCell><Checkbox /></TableCell>
            <TableCell>{pedido.id}</TableCell>
            <TableCell>{pedido.produto}</TableCell>
            <TableCell>{pedido.quantidade}</TableCell>
            <TableCell>R$ {pedido.valorTotal}</TableCell>
            <TableCell>{pedido.statusPagamento}</TableCell>
            <TableCell>
              <Select defaultValue={pedido.statusLogistica}>
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