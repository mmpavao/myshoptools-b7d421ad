import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import firebaseOperations from '../../firebase/firebaseOperations';
import { useAuth } from '../../components/Auth/AuthProvider';
import { toast } from "@/components/ui/use-toast";

const DetalheProduto = () => {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [isImportado, setIsImportado] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const produtoData = await firebaseOperations.getProduct(id);
        setProduto(produtoData);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Imagem do Produto */}
        <div className="md:w-1/2">
          <img src={produto.fotos[0] || "/placeholder.svg"} alt={produto.titulo} className="w-full h-auto object-cover rounded-lg" />
          <div className="flex mt-4 gap-2">
            {produto.fotos.map((img, index) => (
              <img key={index} src={img} alt={`${produto.titulo} ${index + 1}`} className="w-20 h-20 object-cover rounded-lg cursor-pointer" />
            ))}
          </div>
        </div>

        {/* Detalhes do Produto */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{produto.titulo}</h1>
          <h2 className="text-xl text-gray-600 mb-4">{produto.sku}</h2>
          
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-5 h-5 ${i < Math.floor(4.5) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-2 text-gray-600">(35 avaliações)</span>
          </div>

          <div className="mb-4">
            <span className="text-3xl font-bold text-primary">R$ {produto.preco.toFixed(2)}</span>
            <span className="ml-2 text-gray-500 line-through">R$ {(produto.preco * 1.2).toFixed(2)}</span>
            <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">-20%</span>
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
                  <p>Avaliações dos clientes serão exibidas aqui.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DetalheProduto;