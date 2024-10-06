import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import firebaseOperations from '../../firebase/firebaseOperations';
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/Auth/AuthProvider';

const Vitrine = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtosImportados, setProdutosImportados] = useState({});
  const [avaliacaoAtual, setAvaliacaoAtual] = useState({ produtoId: null, nota: 0, comentario: '' });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProdutos();
    }
  }, [user]);

  const fetchProdutos = async () => {
    try {
      const produtosData = await firebaseOperations.getProducts();
      setProdutos(produtosData);
      if (user) {
        const importadosStatus = {};
        for (const produto of produtosData) {
          importadosStatus[produto.id] = await firebaseOperations.verificarProdutoImportado(user.uid, produto.id);
        }
        setProdutosImportados(importadosStatus);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos.",
        variant: "destructive",
      });
    }
  };

  const handleImportar = async (produto) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para importar produtos.",
        variant: "destructive",
      });
      return;
    }

    try {
      await firebaseOperations.importarProduto(user.uid, produto);
      setProdutosImportados(prev => ({ ...prev, [produto.id]: true }));
      toast({
        title: "Sucesso",
        description: "Produto importado com sucesso!",
      });
      navigate('/meus-produtos');
    } catch (error) {
      console.error("Erro ao importar produto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível importar o produto.",
        variant: "destructive",
      });
    }
  };

  const handleDetalhes = (produtoId) => {
    navigate(`/produto/${produtoId}`);
  };

  const handleAvaliar = (produtoId) => {
    setAvaliacaoAtual({ produtoId, nota: 0, comentario: '' });
  };

  const handleSubmitAvaliacao = async () => {
    try {
      await firebaseOperations.adicionarAvaliacao(avaliacaoAtual.produtoId, user.uid, avaliacaoAtual.nota, avaliacaoAtual.comentario);
      toast({
        title: "Sucesso",
        description: "Avaliação enviada com sucesso!",
      });
      setAvaliacaoAtual({ produtoId: null, nota: 0, comentario: '' });
      fetchProdutos(); // Recarrega os produtos para atualizar as avaliações
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a avaliação.",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <StarIcon key={index} className={`w-5 h-5 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Vitrine</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {produtos.map((produto) => (
          <Card key={produto.id}>
            <CardHeader>
              <CardTitle>{produto.titulo}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={produto.fotos[0] || "/placeholder.svg"} alt={produto.titulo} className="w-full h-48 object-cover mb-2" />
              <div className="flex justify-between items-center mb-2">
                <p className="text-2xl font-bold text-primary">R$ {produto.preco.toFixed(2)}</p>
                {produto.desconto > 0 && (
                  <div>
                    <span className="text-gray-500 line-through mr-2">R$ {(produto.preco / (1 - produto.desconto / 100)).toFixed(2)}</span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">-{produto.desconto}%</span>
                  </div>
                )}
              </div>
              <p>Estoque: {produto.estoque}</p>
              <p>Venda sugerida: R$ {produto.vendaSugerida.toFixed(2)}</p>
              <div className="flex items-center mt-2">
                {renderStars(produto.avaliacao || 0)}
                <span className="ml-2 text-sm text-gray-600">({produto.numeroAvaliacoes || 0})</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => handleDetalhes(produto.id)}>Detalhes</Button>
              <Button 
                onClick={() => handleImportar(produto)}
                disabled={produtosImportados[produto.id]}
              >
                {produtosImportados[produto.id] ? 'Importado' : 'Importar'}
              </Button>
            </CardFooter>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => handleAvaliar(produto.id)}>Avaliar</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Avaliar Produto</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`w-8 h-8 cursor-pointer ${star <= avaliacaoAtual.nota ? 'text-yellow-400' : 'text-gray-300'}`}
                          onClick={() => setAvaliacaoAtual(prev => ({ ...prev, nota: star }))}
                        />
                      ))}
                    </div>
                    <Textarea
                      placeholder="Deixe seu comentário"
                      value={avaliacaoAtual.comentario}
                      onChange={(e) => setAvaliacaoAtual(prev => ({ ...prev, comentario: e.target.value }))}
                    />
                    <Button onClick={handleSubmitAvaliacao}>Enviar Avaliação</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Vitrine;