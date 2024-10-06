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
  const [notification, setNotification] = useState(null);
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
      setNotification({
        type: 'info',
        message: 'Produtos carregados com sucesso.'
      });
    } catch (error) {
      console.error("Erro ao buscar meus produtos:", error);
      setNotification({
        type: 'error',
        message: 'Não foi possível carregar seus produtos.'
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
      setDialogOpen(false);
      setNotification({
        type: 'success',
        message: 'Avaliação enviada com sucesso!'
      });
      setAvaliacaoAtual({ produtoId: null, nota: 0, comentario: '' });
      fetchMeusProdutos();
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      setNotification({
        type: 'error',
        message: 'Não foi possível enviar a avaliação.'
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

  const renderNotification = () => {
    if (!notification) return null;

    let bgColor, textColor, icon;
    switch (notification.type) {
      case 'info':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-700';
        icon = (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="flex-none fill-current text-blue-500 h-4 w-4">
            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-.001 5.75c.69 0 1.251.56 1.251 1.25s-.561 1.25-1.251 1.25-1.249-.56-1.249-1.25.559-1.25 1.249-1.25zm2.001 12.25h-4v-1c.484-.179 1-.201 1-.735v-4.467c0-.534-.516-.618-1-.797v-1h3v6.265c0 .535.517.558 1 .735v.999z" />
          </svg>
        );
        break;
      case 'success':
        bgColor = 'bg-green-100';
        textColor = 'text-green-700';
        icon = (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="flex-none fill-current text-green-500 h-4 w-4">
            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.25 16.518l-4.5-4.319 1.396-1.435 3.078 2.937 6.105-6.218 1.421 1.409-7.5 7.626z" />
          </svg>
        );
        break;
      case 'error':
        bgColor = 'bg-red-100';
        textColor = 'text-red-700';
        icon = (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="flex-none fill-current text-red-500 h-4 w-4">
            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.597 17.954l-4.591-4.55-4.555 4.596-1.405-1.405 4.547-4.592-4.593-4.552 1.405-1.405 4.588 4.543 4.545-4.589 1.416 1.403-4.546 4.587 4.592 4.548-1.403 1.416z" />
          </svg>
        );
        break;
      default:
        return null;
    }

    return (
      <div className={`p-5 w-full sm:w-1/2 ${bgColor} ${notification.type === 'info' ? 'border-l-4 border-blue-500' : 'rounded'}`}>
        <div className="flex space-x-3">
          {icon}
          <div className={`flex-1 leading-tight text-sm ${textColor}`}>{notification.message}</div>
        </div>
      </div>
    );
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
      <div className="p-10 flex flex-col space-y-3">
        {renderNotification()}
      </div>
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
                    <Button onClick={() => {
                      handleSubmitAvaliacao();
                      setDialogOpen(false);
                    }}>Enviar Avaliação</Button>
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