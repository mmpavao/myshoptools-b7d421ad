import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import firebaseOperations from '../../firebase/firebaseOperations';
import { useAuth } from '../../components/Auth/AuthProvider';
import { toast } from "@/components/ui/use-toast";

const DetalheProduto = () => {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [isImportado, setIsImportado] = useState(false);
  const [fotoPrincipal, setFotoPrincipal] = useState('');
  const [avaliacaoAtual, setAvaliacaoAtual] = useState({ nota: 0, comentario: '' });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const produtoData = await firebaseOperations.getProduct(id);
        setProduto(produtoData);
        setFotoPrincipal(produtoData.fotos[0] || "/placeholder.svg");
        if (user) {
          const importado = await firebaseOperations.verificarProdutoImportado(user.uid, id);
          setIsImportado(importado);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do produto:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os detalhes do produto.",
          variant: "destructive",
        });
      }
    };

    fetchProduto();
  }, [id, user]);

  const handleImportar = async () => {
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
      setIsImportado(true);
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

  if (!produto) return <div>Carregando...</div>;

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : '0.00';
  };

  const handleThumbnailClick = (foto) => {
    setFotoPrincipal(foto);
  };

  const handleSubmitAvaliacao = async () => {
    try {
      await firebaseOperations.adicionarAvaliacao(id, user.uid, avaliacaoAtual.nota, avaliacaoAtual.comentario);
      toast({
        title: "Sucesso",
        description: "Avaliação enviada com sucesso!",
      });
      setAvaliacaoAtual({ nota: 0, comentario: '' });
      // Recarregar o produto para atualizar as avaliações
      const produtoAtualizado = await firebaseOperations.getProduct(id);
      setProduto(produtoAtualizado);
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

  if (!produto) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Imagem do Produto */}
        <div className="md:w-1/2">
          <img src={fotoPrincipal} alt={produto.titulo} className="w-full h-auto object-cover rounded-lg mb-4" />
          <div className="grid grid-cols-4 gap-2">
            {produto.fotos.slice(0, 4).map((img, index) => (
              <img 
                key={index} 
                src={img} 
                alt={`${produto.titulo} ${index + 1}`} 
                className="w-full h-24 object-cover rounded-lg cursor-pointer" 
                onClick={() => handleThumbnailClick(img)}
              />
            ))}
          </div>
          {produto.fotos.length > 4 && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" className="mt-2 w-full">
                  Ver todas as fotos
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <div className="grid grid-cols-3 gap-4">
                  {produto.fotos.map((img, index) => (
                    <img 
                      key={index} 
                      src={img} 
                      alt={`${produto.titulo} ${index + 1}`} 
                      className="w-full h-auto object-cover rounded-lg cursor-pointer" 
                      onClick={() => handleThumbnailClick(img)}
                    />
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Detalhes do Produto */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{produto.titulo}</h1>
          <h2 className="text-xl text-gray-600 mb-4">{produto.sku}</h2>
          
          <div className="flex items-center mb-4">
            {renderStars(produto.avaliacao || 0)}
            <span className="ml-2 text-gray-600">({produto.numeroAvaliacoes || 0} avaliações)</span>
          </div>

          <div className="mb-4">
            <span className="text-3xl font-bold text-primary">R$ {produto.preco.toFixed(2)}</span>
            {produto.desconto > 0 && (
              <>
                <span className="ml-2 text-gray-500 line-through">R$ {(produto.preco / (1 - produto.desconto / 100)).toFixed(2)}</span>
                <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">-{produto.desconto}%</span>
              </>
            )}
          </div>

          {/* Variações */}
          {produto.variacoes && Object.entries(produto.variacoes).map(([tipo, opcoes]) => opcoes.length > 0 && (
            <div key={tipo} className="mb-4">
              <h3 className="text-lg font-semibold mb-2 capitalize">{tipo}:</h3>
              <div className="flex gap-2">
                {opcoes.map((opcao) => (
                  <Button key={opcao} variant="outline">{opcao}</Button>
                ))}
              </div>
            </div>
          ))}

          {/* Botão Adicionar/Adicionado */}
          <div className="mb-6">
            <Button 
              className="w-full" 
              onClick={handleImportar}
              disabled={isImportado}
            >
              {isImportado ? 'Adicionado' : 'Adicionar'}
            </Button>
          </div>

          {/* Tabs de Informações */}
          <Tabs defaultValue="descricao">
            <TabsList>
              <TabsTrigger value="descricao">Descrição</TabsTrigger>
              <TabsTrigger value="especificacoes">Especificações</TabsTrigger>
              <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
            </TabsList>
            <TabsContent value="descricao">
              <Card>
                <CardContent className="pt-6">
                  <p>{produto.descricao}</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="especificacoes">
              <Card>
                <CardContent className="pt-6">
                  <ul className="list-disc pl-5">
                    <li>SKU: {produto.sku}</li>
                    <li>Estoque: {produto.estoque}</li>
                    <li>Preço de Venda Sugerido: R$ {produto.vendaSugerida.toFixed(2)}</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="avaliacoes">
              <Card>
                <CardContent className="pt-6">
                  {produto.avaliacoes && produto.avaliacoes.length > 0 ? (
                    produto.avaliacoes.map((avaliacao, index) => (
                      <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                        <div className="flex items-center mb-2">
                          {renderStars(avaliacao.nota)}
                          <span className="ml-2 text-sm text-gray-600">{avaliacao.data}</span>
                        </div>
                        <p>{avaliacao.comentario}</p>
                      </div>
                    ))
                  ) : (
                    <p>Ainda não há avaliações para este produto.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Botão para Avaliar */}
          <div className="mt-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Avaliar Produto</Button>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalheProduto;