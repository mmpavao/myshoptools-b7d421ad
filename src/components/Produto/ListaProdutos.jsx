import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StarIcon, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import firebaseOperations from '../../firebase/firebaseOperations';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '../../components/Auth/AuthProvider';

const ListaProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProdutosImportados();
    }
  }, [user]);

  const fetchProdutosImportados = async () => {
    try {
      const produtosImportados = await firebaseOperations.getProdutosImportados(user.uid);
      setProdutos(produtosImportados);
    } catch (error) {
      console.error("Erro ao buscar produtos importados:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos importados.",
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
        description: "Produto removido da sua lista com sucesso.",
      });
      fetchProdutosImportados(); // Atualiza a lista após a exclusão
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o produto.",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <StarIcon key={index} className={`w-5 h-5 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : '0.00';
  };

  const produtosFiltrados = produtos.filter(produto =>
    produto.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
    produto.sku.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Lista de Produtos Importados</h1>
      <Input
        placeholder="Filtrar por título ou SKU"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="max-w-sm mb-4"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {produtosFiltrados.map((produto) => (
          <Card key={produto.id} className="flex flex-col">
            <CardContent className="p-4">
              <img src={produto.fotos[0] || "/placeholder.svg"} alt={produto.titulo} className="w-full h-48 object-cover mb-2 rounded" />
              <h2 className="text-lg font-semibold mb-2 line-clamp-2">{produto.titulo}</h2>
              <p className="text-sm text-gray-500 mb-2">SKU: {produto.sku}</p>
              <div className="flex justify-between items-center mb-2">
                <p className="text-xl font-bold text-primary">R$ {formatPrice(produto.preco)}</p>
                <div className="flex items-center">
                  {renderStars(produto.avaliacao || 0)}
                  <span className="ml-1 text-sm text-gray-600">({produto.numeroAvaliacoes || 0})</span>
                </div>
              </div>
              <p className="text-sm">Estoque: {produto.estoque}</p>
            </CardContent>
            <CardFooter className="p-4 mt-auto flex justify-between">
              <Button onClick={() => handleDetalhes(produto.id)}>Ver Detalhes</Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Excluir
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmar exclusão</DialogTitle>
                    <DialogDescription>
                      Tem certeza que deseja remover este produto da sua lista? Esta ação não pode ser desfeita.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {}}>Cancelar</Button>
                    <Button variant="destructive" onClick={() => handleExcluir(produto.id)}>Confirmar Exclusão</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ListaProdutos;
