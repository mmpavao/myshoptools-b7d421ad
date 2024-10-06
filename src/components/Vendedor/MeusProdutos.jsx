import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { StarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import firebaseOperations from '../../firebase/firebaseOperations';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '../../components/Auth/AuthProvider';

const MeusProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avaliacaoAtual, setAvaliacaoAtual] = useState({ produtoId: null, nota: 0, comentario: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMeusProdutos();
    }
  }, [user]);

  const fetchMeusProdutos = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const produtosData = await firebaseOperations.getMeusProdutos(user.uid);
      setProdutos(produtosData);
    } catch (error) {
      console.error("Erro ao buscar meus produtos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus produtos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvaliar = (produtoId) => {
    setAvaliacaoAtual({ produtoId, nota: 0, comentario: '' });
    setDialogOpen(true);
  };

  const handleSubmitAvaliacao = async () => {
    try {
      await firebaseOperations.adicionarAvaliacao(avaliacaoAtual.produtoId, user.uid, avaliacaoAtual.nota, avaliacaoAtual.comentario);
      setDialogOpen(false); // Ensure the dialog is closed
      toast({
        title: "Sucesso",
        description: "Avaliação enviada com sucesso!",
      });
      setAvaliacaoAtual({ produtoId: null, nota: 0, comentario: '' });
      fetchMeusProdutos(); // Atualizar a lista de produtos
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

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : '0.00';
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (produtos.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Meus Produtos</h1>
        <p>Você ainda não importou nenhum produto para sua loja.</p>
        <Link to="/vitrine">
          <Button>Ir para a Vitrine</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Meus Produtos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {produtos.map((produto) => (
          <Card key={produto.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="line-clamp-2 h-14 overflow-hidden">{produto.titulo}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <img src={produto.fotos[0] || "/placeholder.svg"} alt={produto.titulo} className="w-full h-48 object-cover mb-2" />
              <div className="flex justify-between items-center mb-2">
                <p className="text-2xl font-bold text-primary">R$ {formatPrice(produto.preco)}</p>
                {produto.desconto > 0 && (
                  <div>
                    <span className="text-gray-500 line-through mr-2">
                      R$ {formatPrice(produto.preco / (1 - produto.desconto / 100))}
                    </span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">-{produto.desconto}%</span>
                  </div>
                )}
              </div>
              <p>Estoque: {produto.estoque}</p>
              <p>Venda Sugerida: R$ {formatPrice(produto.vendaSugerida)}</p>
            </CardContent>
            <CardFooter className="flex justify-between mt-auto">
              <Button variant="outline">Editar</Button>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleAvaliar(produto.id)}>Avaliar</Button>
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

export default MeusProdutos;