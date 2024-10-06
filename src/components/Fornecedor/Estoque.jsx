import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
            />
          </DialogContent>
        </Dialog>
      </div>

      <EstoqueTable 
        produtos={produtosFiltrados} 
        onDelete={handleDeleteProduct} 
        onDetalhes={(productId) => navigate(`/produto/${productId}`)}
        onEdit={handleEditProduct}
      />
    </div>
  );
};

export default Estoque;
