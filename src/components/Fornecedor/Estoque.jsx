import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import firebaseOperations from '../../firebase/firebaseOperations';
import EstoqueForm from './EstoqueForm';
import EstoqueTable from './EstoqueTable';
import { useNavigate } from 'react-router-dom';
import { useEstoque } from './useEstoque'; // We'll create this custom hook

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
    handleEditProduct, // New function
    resetNovoProduto
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
            <Button onClick={resetNovoProduto}>Novo Produto</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{novoProduto.id ? 'Editar Produto' : 'Adicionar Novo Produto'}</DialogTitle>
            </DialogHeader>
            <EstoqueForm
              novoProduto={novoProduto}
              handleInputChange={handleInputChange}
              handleFileChange={handleFileChange}
              handleSubmit={handleSubmit}
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