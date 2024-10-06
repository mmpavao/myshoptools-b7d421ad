import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import firebaseOperations from '../../firebase/firebaseOperations';
import { toast } from "@/components/ui/use-toast";
import EstoqueForm from './EstoqueForm';
import EstoqueTable from './EstoqueTable';
import { useNavigate } from 'react-router-dom';

const Estoque = () => {
  const [produtos, setProdutos] = useState([]);
  const [novoProduto, setNovoProduto] = useState({
    titulo: '', fotos: [], descricao: '', sku: '', estoque: 0, preco: 0, desconto: 0, tipoDesconto: '%', variacoes: [], vendaSugerida: 0
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const produtosData = await firebaseOperations.getProducts();
      setProdutos(produtosData);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoProduto(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const uploadPromises = files.map(file => firebaseOperations.uploadProductImage(file, 'temp'));
    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      setNovoProduto(prev => ({ ...prev, fotos: [...prev.fotos, ...uploadedUrls] }));
    } catch (error) {
      console.error("Erro ao fazer upload das imagens:", error);
      toast({
        title: "Erro",
        description: "Falha ao enviar as imagens.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const produtoParaSalvar = {
        ...novoProduto,
        preco: Number(novoProduto.preco),
        desconto: Number(novoProduto.desconto),
        estoque: Number(novoProduto.estoque),
        vendaSugerida: Number(novoProduto.vendaSugerida)
      };
      if (editingProductId) {
        await firebaseOperations.updateProduct(editingProductId, produtoParaSalvar);
        toast({
          title: "Sucesso",
          description: "Produto atualizado com sucesso!",
        });
      } else {
        await firebaseOperations.createProduct(produtoParaSalvar);
        toast({
          title: "Sucesso",
          description: "Produto adicionado com sucesso!",
        });
      }
      fetchProdutos();
      setIsDialogOpen(false);
      setNovoProduto({
        titulo: '', fotos: [], descricao: '', sku: '', estoque: 0, preco: 0, desconto: 0, tipoDesconto: '%', variacoes: [], vendaSugerida: 0
      });
      setEditingProductId(null);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o produto.",
        variant: "destructive",
      });
    }
  };

  const calcularMarkup = () => {
    const precoComDesconto = novoProduto.tipoDesconto === '%' 
      ? novoProduto.preco * (1 - novoProduto.desconto / 100)
      : novoProduto.preco - novoProduto.desconto;
    const markup = novoProduto.vendaSugerida / precoComDesconto;
    return markup.toFixed(2) + 'x';
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await firebaseOperations.deleteProduct(productId);
      toast({
        title: "Sucesso",
        description: "Produto removido com sucesso!",
      });
      fetchProdutos();
    } catch (error) {
      console.error("Erro ao remover produto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o produto.",
        variant: "destructive",
      });
    }
  };

  const handleDetalhes = (productId) => {
    navigate(`/produto/${productId}`);
  };

  const handleEditProduct = (product) => {
    setNovoProduto(product);
    setEditingProductId(product.id);
    setIsDialogOpen(true);
  };

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
            <Button onClick={() => {
              setNovoProduto({
                titulo: '', fotos: [], descricao: '', sku: '', estoque: 0, preco: 0, desconto: 0, tipoDesconto: '%', variacoes: [], vendaSugerida: 0
              });
              setEditingProductId(null);
              setIsDialogOpen(true);
            }}>Novo Produto</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingProductId ? 'Editar Produto' : 'Adicionar Novo Produto'}</DialogTitle>
            </DialogHeader>
            <EstoqueForm
              novoProduto={novoProduto}
              handleInputChange={handleInputChange}
              handleFileChange={handleFileChange}
              handleSubmit={handleSubmit}
              calcularMarkup={calcularMarkup}
            />
          </DialogContent>
        </Dialog>
      </div>

      <EstoqueTable 
        produtos={produtosFiltrados} 
        onDelete={handleDeleteProduct} 
        onDetalhes={handleDetalhes}
        onEdit={handleEditProduct}
      />
    </div>
  );
};

export default Estoque;
