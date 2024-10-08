import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import firebaseOperations from '../../firebase/firebaseOperations';
import ProdutoCard from './ProdutoCard';
import { useAuth } from '../Auth/AuthProvider';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MeusProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('MyShop');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMeusProdutos();
    }
  }, [user]);

  const fetchMeusProdutos = async () => {
    try {
      const produtosData = await firebaseOperations.getMeusProdutos(user.uid);
      setProdutos(produtosData);
    } catch (error) {
      console.error("Erro ao buscar meus produtos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus produtos.",
        variant: "destructive",
      });
    }
  };

  const handleDetalhes = (produtoId) => {
    navigate(`/produto/${produtoId}`);
  };

  const handleExcluir = async (produtoId) => {
    try {
      await firebaseOperations.removerProdutoImportado(user.uid, produtoId);
      toast({
        title: "Sucesso",
        description: "Produto removido com sucesso.",
      });
      fetchMeusProdutos();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o produto.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (produto) => {
    setEditingProduct(produto);
  };

  const handleSaveEdit = async () => {
    try {
      await firebaseOperations.updateMeuProduto(user.uid, editingProduct.id, editingProduct);
      toast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso.",
      });
      setEditingProduct(null);
      fetchMeusProdutos();
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o produto.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({ ...prev, [name]: value }));
  };

  const produtosFiltrados = produtos.filter(produto =>
    produto.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
    produto.sku.toLowerCase().includes(filtro.toLowerCase())
  );

  const marketplaces = ['MyShop', 'Mercado Livre', 'Shopee', 'Amazon', 'Shopify', 'WooCommerce'];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Meus Produtos</h1>
      
      <Card className="bg-gray-100">
        <CardContent className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {marketplaces.map((marketplace) => (
                <TabsTrigger
                  key={marketplace}
                  value={marketplace}
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  {marketplace}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <Input
        placeholder="Filtrar por título ou SKU"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="max-w-sm mb-4"
      />
      
      {produtos.length === 0 ? (
        <p>Você ainda não importou nenhum produto para {activeTab}.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {produtosFiltrados.map((produto) => (
            <ProdutoCard
              key={produto.id}
              produto={produto}
              onDetalhes={handleDetalhes}
              onExcluir={handleExcluir}
              onEdit={() => handleEdit(produto)}
              showExcluirButton={true}
              showEditButton={true}
            />
          ))}
        </div>
      )}

      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título</Label>
                <Input id="titulo" name="titulo" value={editingProduct.titulo} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea id="descricao" name="descricao" value={editingProduct.descricao} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="precoVenda">Preço de Venda</Label>
                <Input id="precoVenda" name="precoVenda" type="number" value={editingProduct.precoVenda} onChange={handleInputChange} />
              </div>
              <Button onClick={handleSaveEdit}>Salvar Alterações</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MeusProdutos;