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
      console.log("Produtos carregados:", produtosData);
      setProdutos(produtosData);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const renderProductImage = (foto) => {
    if (typeof foto === 'string' && foto.startsWith('http')) {
      return <img src={foto} alt="Produto" className="w-full h-48 object-cover mb-2" />;
    } else {
      return <img src="/placeholder.svg" alt="Placeholder" className="w-full h-48 object-cover mb-2" />;
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
      console.log("Avaliação enviada com sucesso!");
      setAvaliacaoAtual({ produtoId: null, nota: 0, comentario: '' });
      fetchProdutos();
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
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
      <h1 className="text-2xl font-bold text-foreground">Vitrine</h1>
      <Input
        placeholder="Filtrar por título ou SKU"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="max-w-sm mb-4"
      />
      {produtos.length === 0 ? (
        <p className="text-foreground">Carregando produtos...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {produtosFiltrados.map((produto) => (
            <Card key={produto.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="line-clamp-2 h-14 overflow-hidden">{produto.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                {produto.fotos && produto.fotos.length > 0
                  ? renderProductImage(produto.fotos[0])
                  : <img src="/placeholder.svg" alt="Placeholder" className="w-full h-48 object-cover mb-2" />
                }
                <p className="text-2xl font-bold text-primary">R$ {formatPrice(produto.preco)}</p>
                {produto.desconto > 0 && (
                  <div>
                    <span className="text-muted-foreground line-through mr-2">
                      R$ {formatPrice(produto.preco / (1 - produto.desconto / 100))}
                    </span>
                    <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-sm">-{produto.desconto}%</span>
                  </div>
                )}
                <p className="text-foreground">Estoque: {produto.estoque}</p>
                <p className="text-foreground">Venda Sugerida: R$ {formatPrice(produto.vendaSugerida)}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    {renderStars(produto.avaliacao || 0)}
                    <span className="ml-2 text-sm text-muted-foreground">({produto.numeroAvaliacoes || 0})</span>
                  </div>
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
                              className={`w-8 h-8 cursor-pointer ${star <= avaliacaoAtual.nota ? 'text-yellow-400' : 'text-muted-foreground'}`}
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
                </div>
              </CardContent>
              <CardFooter className="flex justify-between mt-auto">
                <Button variant="outline" onClick={() => handleDetalhes(produto.id)}>Detalhes</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Vitrine;