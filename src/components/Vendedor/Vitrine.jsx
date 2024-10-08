import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import firebaseOperations from '../../firebase/firebaseOperations';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/Auth/AuthProvider';

const Vitrine = () => {
  const [produtos, setProdutos] = useState([]);
  const [avaliacaoAtual, setAvaliacaoAtual] = useState({ produtoId: null, nota: 0, comentario: '' });
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchProdutos();
  }, [user]);

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

  const handleDetalhes = (produtoId) => {
    navigate(`/produto/${produtoId}`);
  };

  const handleAvaliar = (produtoId) => {
    setAvaliacaoAtual({ produtoId, nota: 0, comentario: '' });
  };

  const handleSubmitAvaliacao = async () => {
    try {
      await firebaseOperations.adicionarAvaliacao(
        avaliacaoAtual.produtoId,
        user.uid,
        avaliacaoAtual.nota,
        avaliacaoAtual.comentario
      );
      toast({
        title: "Sucesso",
        description: "Avaliação enviada com sucesso!",
      });
      fetchProdutos();
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a avaliação.",
        variant: "destructive",
      });
    }
  };

  const renderProductImage = (foto) => (
    <div className="aspect-square w-full overflow-hidden rounded-lg">
      <img 
        src={foto && foto.startsWith('http') ? foto : "/placeholder.svg"}
        alt="Produto" 
        className="w-full h-full object-cover"
      />
    </div>
  );

  const renderStars = (rating) => (
    [...Array(5)].map((_, index) => (
      <StarIcon key={index} className={`w-4 h-4 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
    ))
  );

  const formatPrice = (price) => (typeof price === 'number' ? price.toFixed(2) : '0.00');

  const produtosFiltrados = produtos.filter(produto =>
    produto.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
    produto.sku.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Vitrine</h1>
      <Input
        placeholder="Filtrar por título ou SKU"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="max-w-sm mb-4"
      />
      {produtos.length === 0 ? (
        <p>Carregando produtos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produtosFiltrados.map((produto) => (
            <Card key={produto.id} className="flex flex-col">
              <CardHeader className="p-4">
                <CardTitle className="text-lg line-clamp-2">{produto.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                {renderProductImage(produto.fotos && produto.fotos[0])}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-primary">R$ {formatPrice(produto.preco)}</p>
                    {produto.desconto > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">-{produto.desconto}%</span>
                    )}
                  </div>
                  {produto.desconto > 0 && (
                    <p className="text-sm text-gray-500 line-through">
                      R$ {formatPrice(produto.preco / (1 - produto.desconto / 100))}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {renderStars(produto.avaliacao || 0)}
                      <span className="ml-2 text-sm text-gray-600">({produto.numeroAvaliacoes || 0})</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 flex justify-between">
                <Button variant="outline" size="sm" onClick={() => handleDetalhes(produto.id)}>Detalhes</Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => handleAvaliar(produto.id)}>Avaliar</Button>
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
      )}
    </div>
  );
};

export default Vitrine;