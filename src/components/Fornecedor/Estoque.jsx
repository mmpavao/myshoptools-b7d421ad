import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import EstoqueForm from './EstoqueForm';
import EstoqueTable from './EstoqueTable';
import { useNavigate } from 'react-router-dom';
import { useEstoque } from './useEstoque';
import { Package, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

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
    generateAIContent,
    stats
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

  const StatCard = ({ title, value, icon: Icon }) => (
    <Card>
      <CardContent className="flex flex-row items-center justify-between p-6">
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <span className="text-2xl font-bold">{value}</span>
        </div>
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Estoque</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total de Produtos" value={stats.total} icon={Package} />
        <StatCard title="Produtos com Estoque Baixo" value={stats.lowStock} icon={AlertTriangle} />
        <StatCard title="Produtos Mais Vendidos" value={stats.bestSellers} icon={TrendingUp} />
        <StatCard title="Produtos Menos Vendidos" value={stats.worstSellers} icon={TrendingDown} />
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
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
            <TabsList className="mb-4">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Estoque;