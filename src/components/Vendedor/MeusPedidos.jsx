import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const MeusPedidos = () => {
  // Simulação de pedidos
  const pedidos = [
    { id: 1, plataforma: 'Mercado Livre', produto: 'Produto 1', precoVenda: 150, precoFornecedor: 100, status: 'Pendente' },
    { id: 2, plataforma: 'Amazon', produto: 'Produto 2', precoVenda: 300, precoFornecedor: 200, status: 'Pago' },
    // Adicione mais pedidos conforme necessário
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Meus Pedidos</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Plataforma</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Preço de Venda</TableHead>
            <TableHead>Preço Fornecedor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pedidos.map((pedido) => (
            <TableRow key={pedido.id}>
              <TableCell>{pedido.id}</TableCell>
              <TableCell>{pedido.plataforma}</TableCell>
              <TableCell>{pedido.produto}</TableCell>
              <TableCell>R$ {pedido.precoVenda}</TableCell>
              <TableCell>R$ {pedido.precoFornecedor}</TableCell>
              <TableCell>{pedido.status}</TableCell>
              <TableCell>
                <Button variant="outline" disabled={pedido.status === 'Pago'}>
                  {pedido.status === 'Pago' ? 'Pago' : 'Pagar'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MeusPedidos;