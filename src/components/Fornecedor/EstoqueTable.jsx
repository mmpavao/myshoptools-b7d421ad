import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from 'lucide-react';

const EstoqueTable = ({ produtos, onDelete }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]"><Checkbox /></TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Título</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead>Estoque</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {produtos.map((produto) => (
          <TableRow key={produto.id}>
            <TableCell><Checkbox /></TableCell>
            <TableCell>{produto.sku}</TableCell>
            <TableCell>{produto.titulo}</TableCell>
            <TableCell>R$ {produto.preco}</TableCell>
            <TableCell>{produto.estoque}</TableCell>
            <TableCell className="space-x-2">
              <Button variant="outline" size="icon"><Eye className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" onClick={() => onDelete(produto.id)}><Trash2 className="h-4 w-4" /></Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EstoqueTable;