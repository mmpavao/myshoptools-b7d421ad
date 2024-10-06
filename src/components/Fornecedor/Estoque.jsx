import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EstoqueForm from './EstoqueForm';
import EstoqueTable from './EstoqueTable';
import { useNavigate } from 'react-router-dom';
import { useEstoque } from './useEstoque';

const Estoque = () => {
  const navigate = useNavigate();
  const { 
    produtos, 
    novoProduto, 
    isDialogOpen, 
    filtro, 
    handleInputChange, 
    handleFileChange, 
    handleSubmit, 
    handleDeleteProduct, 
    setIsDialogOpen, 
    setFiltro,
    handleEditProduct,
    resetNovoProduto,
    calcularMarkup,
    updateFotos,
    generateAIContent
  } = useEstoque();

  const produtosFiltrados = produtos.filter(produto =>
    produto.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
    produto.sku.toLowerCase().includes(filtro.toLowerCase())
  );

  const produtosAtivos = produtosFiltrados.filter(produto => produto.status === 'ativo');
  const produtosInativos = produtosFiltrados.filter(produto => produto.status === 'inativo');

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const newFotos = Array.from(novoProduto.fotos);
    const [reorderedItem] = newFotos.splice(result.source.index, 1);
    newFotos.splice(result.destination.index, 0, reorderedItem);
    updateFotos(newFotos);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Estoque</h1>
      
      <div className="flex justify-between items-center">
        <Input
          placeholder="Filtrar por título ou SKU"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="max-w-sm"
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetNovoProduto(); setIsDialogOpen(true); }}>Novo Produto</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-full">
            <DialogHeader>
              <DialogTitle>{novoProduto.id ? 'Editar Produto' : 'Adicionar Novo Produto'}</DialogTitle>
            </DialogHeader>
            <EstoqueForm
              novoProduto={novoProduto}
              handleInputChange={handleInputChange}
              handleFileChange={handleFileChange}
              handleSubmit={handleSubmit}
              calcularMarkup={calcularMarkup}
              updateFotos={updateFotos}
              generateAIContent={generateAIContent}
              onDragEnd={onDragEnd}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="todos">
        <TabsList>
          <TabsTrigger value="todos">Todos os Produtos</TabsTrigger>
          <TabsTrigger value="ativos">Produtos Ativos</TabsTrigger>
          <TabsTrigger value="inativos">Produtos Inativos</TabsTrigger>
        </TabsList>
        <TabsContent value="todos">
          <EstoqueTable 
            produtos={produtosFiltrados} 
            onDelete={handleDeleteProduct} 
            onDetalhes={(productId) => navigate(`/produto/${productId}`)}
            onEdit={handleEditProduct}
          />
        </TabsContent>
        <TabsContent value="ativos">
          <EstoqueTable 
            produtos={produtosAtivos} 
            onDelete={handleDeleteProduct} 
            onDetalhes={(productId) => navigate(`/produto/${productId}`)}
            onEdit={handleEditProduct}
          />
        </TabsContent>
        <TabsContent value="inativos">
          <EstoqueTable 
            produtos={produtosInativos} 
            onDelete={handleDeleteProduct} 
            onDetalhes={(productId) => navigate(`/produto/${productId}`)}
            onEdit={handleEditProduct}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Estoque;