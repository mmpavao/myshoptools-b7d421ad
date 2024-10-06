import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, Eye } from 'lucide-react';

const Estoque = () => {
  const [produtos, setProdutos] = useState([]);
  const [novoProduto, setNovoProduto] = useState({
    titulo: '', fotos: [], descricao: '', sku: '', estoque: 0, preco: 0, variacoes: [], vendaSugerida: 0
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoProduto(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProdutos(prev => [...prev, { ...novoProduto, id: Date.now() }]);
    setNovoProduto({
      titulo: '', fotos: [], descricao: '', sku: '', estoque: 0, preco: 0, variacoes: [], vendaSugerida: 0
    });
  };

  const calcularMarkup = () => {
    const markup = novoProduto.vendaSugerida / novoProduto.preco;
    return markup.toFixed(1) + 'x';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Estoque</h1>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button>Novo Produto</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Produto</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="titulo" value={novoProduto.titulo} onChange={handleInputChange} placeholder="Título do Produto" />
            <Input name="sku" value={novoProduto.sku} onChange={handleInputChange} placeholder="SKU" />
            <Textarea name="descricao" value={novoProduto.descricao} onChange={handleInputChange} placeholder="Descrição" />
            <Input type="number" name="estoque" value={novoProduto.estoque} onChange={handleInputChange} placeholder="Estoque" />
            <Input type="number" name="preco" value={novoProduto.preco} onChange={handleInputChange} placeholder="Preço do Produto" />
            <Input type="number" name="vendaSugerida" value={novoProduto.vendaSugerida} onChange={handleInputChange} placeholder="Venda Sugerida" />
            <div>Markup: {calcularMarkup()}</div>
            <Button type="submit">Salvar Produto</Button>
          </form>
        </DialogContent>
      </Dialog>

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
                <Button variant="outline" size="icon"><Trash2 className="h-4 w-4" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Estoque;