import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import firebaseOperations from '../../firebase/firebaseOperations';
import { useAuth } from '../../components/Auth/AuthProvider';
import ProductImages from './ProductImages';
import ProductDetails from './ProductDetails';
import ProductTabs from './ProductTabs';
import RatingForm from './RatingForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DetalheProduto = () => {
  const { id } = useParams();
  const location = useLocation();
  const [produto, setProduto] = useState(null);
  const [avaliacaoAtual, setAvaliacaoAtual] = useState({ nota: 0, comentario: '' });
  const [activeTab, setActiveTab] = useState('descricao');
  const [activeMarketplace, setActiveMarketplace] = useState('Fornecedor');
  const { user } = useAuth();

  const isFromVitrine = new URLSearchParams(location.search).get('source') === 'vitrine';

  const marketplaces = [
    'Fornecedor', 'MyShop', 'Mercado Livre', 'Shopee', 'Amazon', 'Shopify', 'WooCommerce'
  ];

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const produtoData = await firebaseOperations.getProduct(id);
        setProduto(produtoData);
      } catch (error) {
        console.error("Erro ao buscar detalhes do produto:", error);
      }
    };

    fetchProduto();
  }, [id]);

  const handleSubmitAvaliacao = async () => {
    try {
      await firebaseOperations.adicionarAvaliacao(id, user.uid, avaliacaoAtual.nota, avaliacaoAtual.comentario);
      console.log("Avaliação enviada com sucesso!");
      setAvaliacaoAtual({ nota: 0, comentario: '' });
      const produtoAtualizado = await firebaseOperations.getProduct(id);
      setProduto(produtoAtualizado);
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
    }
  };

  if (!produto) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {!isFromVitrine && (
        <Tabs value={activeMarketplace} onValueChange={setActiveMarketplace} className="mb-6">
          <TabsList className="w-full flex justify-between overflow-x-auto">
            {marketplaces.map((marketplace) => (
              <TabsTrigger key={marketplace} value={marketplace} className="flex-shrink-0">
                {marketplace}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <ProductImages 
          fotos={produto.fotos} 
          titulo={produto.titulo} 
          activeMarketplace={isFromVitrine ? 'Fornecedor' : activeMarketplace}
        />
        <ProductDetails 
          produto={produto} 
          activeMarketplace={isFromVitrine ? 'Fornecedor' : activeMarketplace}
        />
      </div>
      <ProductTabs 
        produto={produto} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        activeMarketplace={isFromVitrine ? 'Fornecedor' : activeMarketplace}
      />
      {!isFromVitrine && activeMarketplace === 'Fornecedor' && activeTab === 'avaliacoes' && (
        <RatingForm 
          avaliacaoAtual={avaliacaoAtual} 
          setAvaliacaoAtual={setAvaliacaoAtual} 
          handleSubmitAvaliacao={handleSubmitAvaliacao}
        />
      )}
    </div>
  );
};

export default DetalheProduto;