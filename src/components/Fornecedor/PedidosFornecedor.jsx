import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PedidosFornecedor = () => {
  // Simulação de pedidos do fornecedor
  const pedidos = [
    { id: 1, produto: 'Produto 1', quantidade: 2, valorTotal: 200, statusPagamento: 'Pago', statusLogistica: 'Preparando' },
    { id: 2, produto: 'Produto 2', quantidade: 1, valorTotal: 300, statusPagamento: 'Pendente', statusLogistica: 'Aguardando' },
    // Adicione mais pedidos conforme necessário
  ];

  const statusLogisticaOptions = [
    'Preparar para envio', 'Pronto para envio', 'Postado', 'Em trânsito', 'Entregue', 'Cancelado'
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pedidos do Fornecedor</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Valor Total</TableHead>
            <TableHead>Status Pagamento</TableHead>
            <TableHead>Status Logística</TableHead>
            <TableHead>Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pedidos.map((pedido) => (
            <TableRow key={pedido.id}>
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
              <TableCell>
                <Button variant="outline">Atualizar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PedidosFornecedor;