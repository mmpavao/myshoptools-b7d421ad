import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

const CheckTable = ({ data }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Nome</TableHead>
        <TableHead>Progresso</TableHead>
        <TableHead>Quantidade</TableHead>
        <TableHead>Data</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.map((item, index) => (
        <TableRow key={index}>
          <TableCell>{item.nome}</TableCell>
          <TableCell>{item.progresso}%</TableCell>
          <TableCell>{item.quantidade}</TableCell>
          <TableCell>{item.data}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default CheckTable;