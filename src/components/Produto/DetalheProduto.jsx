import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import firebaseOperations from '../../firebase/firebaseOperations';
import { useAuth } from '../../components/Auth/AuthProvider';
import ProductImages from './ProductImages';
import ProductDetails from './ProductDetails';
import ProductTabs from './ProductTabs';
import RatingForm from './RatingForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyShopLandingPage from '../Vendedor/MyShopLandingPage';

const DetalheProduto = () => {
  const { id } = useParams();
  const location = useLocation();
  const [produto, setProduto] = useState(null);
  const [avaliacaoAtual, setAvaliacaoAtual] = useState({ nota: 0, comentario: '' });
  const [activeTab, setActiveTab] = useState('descricao');
  const [activeMarketplace, setActiveMarketplace] = useState('Fornecedor');
  const { user } = useAuth();

  const isMyProduct = location.pathname.includes('/meus-produtos');

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
      {isMyProduct && (
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
          activeMarketplace={isMyProduct ? activeMarketplace : 'Fornecedor'}
        />
        <ProductDetails 
          produto={produto} 
          activeMarketplace={isMyProduct ? activeMarketplace : 'Fornecedor'}
        />
      </div>
      <ProductTabs 
        produto={produto} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        activeMarketplace={isMyProduct ? activeMarketplace : 'Fornecedor'}
      />
      {(!isMyProduct || activeMarketplace === 'Fornecedor') && activeTab === 'avaliacoes' && (
        <RatingForm 
          avaliacaoAtual={avaliacaoAtual} 
          setAvaliacaoAtual={setAvaliacaoAtual} 
          handleSubmitAvaliacao={handleSubmitAvaliacao}
        />
      )}
      {isMyProduct && activeMarketplace === 'MyShop' && (
        <MyShopLandingPage produto={produto} />
      )}
    </div>
  );
};

export default DetalheProduto;