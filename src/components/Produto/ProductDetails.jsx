import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { StarIcon, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { renderStars, formatPrice, calculateOldPrice } from './productUtils';
import firebaseOperations from '../../firebase/firebaseOperations';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '../Auth/AuthProvider';

const ProductDetails = ({ produto, activeMarketplace }) => {
  const [myShopUrl, setMyShopUrl] = useState('');
  const [isSellingOnMyShop, setIsSellingOnMyShop] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user && activeMarketplace === 'MyShop') {
      fetchMyShopUrl();
      checkIfSellingOnMyShop();
    }
  }, [user, activeMarketplace, produto.id]);

  const fetchMyShopUrl = async () => {
    try {
      const url = await firebaseOperations.getMyShopUrl(user.uid);
      setMyShopUrl(url);
    } catch (error) {
      console.error("Erro ao buscar URL da loja MyShop:", error);
    }
  };

  const checkIfSellingOnMyShop = async () => {
    try {
      const isSellingOnMyShop = await firebaseOperations.isProductOnMyShop(user.uid, produto.id);
      setIsSellingOnMyShop(isSellingOnMyShop);
    } catch (error) {
      console.error("Erro ao verificar se o produto está sendo vendido no MyShop:", error);
    }
  };

  const copyMyShopUrl = () => {
    navigator.clipboard.writeText(myShopUrl);
    toast({
      title: "URL Copiada",
      description: "A URL da sua loja MyShop foi copiada para a área de transferência.",
    });
  };

  const handleVenderEmMyShop = async () => {
    try {
      if (isSellingOnMyShop) {
        await firebaseOperations.removeProductFromMyShop(user.uid, produto.id);
        setIsSellingOnMyShop(false);
        toast({
          title: "Produto Removido",
          description: "Produto removido da sua loja MyShop.",
        });
      } else {
        await firebaseOperations.addProductToMyShop(user.uid, produto.id);
        setIsSellingOnMyShop(true);
        toast({
          title: "Sucesso",
          description: "Produto adicionado à sua loja MyShop.",
        });
      }
    } catch (error) {
      console.error("Erro ao gerenciar produto na loja MyShop:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerenciar o produto na loja MyShop.",
        variant: "destructive",
      });
    }
  };

  const renderFornecedorContent = () => (
    <div>
      <div className="mb-4">
        <span className="text-3xl font-bold text-primary">R$ {formatPrice(produto.preco)}</span>
        {produto.desconto > 0 && (
          <>
            <span className="ml-2 text-gray-500 line-through">
              R$ {formatPrice(calculateOldPrice(produto.preco, produto.desconto))}
            </span>
            <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">-{produto.desconto}%</span>
          </>
        )}
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span>SKU:</span>
          <span className="font-semibold">{produto.sku || 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Venda Sugerida:</span>
          <span className="font-semibold">R$ {formatPrice(produto.vendaSugerida)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Estoque Disponível:</span>
          <span className="font-semibold">{produto.estoque || 0}</span>
        </div>
      </div>
      {renderVariacoes(produto.variacoes)}
      <Button className="w-full mt-4">Atualizar Estoque</Button>
    </div>
  );

  const renderVariacoes = (variacoes) => {
    if (!variacoes) return null;
    return Object.entries(variacoes).map(([tipo, opcoes]) => 
      opcoes.length > 0 && (
        <div key={tipo} className="mb-4">
          <h3 className="text-lg font-semibold mb-2 capitalize">{tipo}:</h3>
          <div className="flex gap-2">
            {opcoes.map((opcao) => (
              <Button key={opcao} variant="outline">{opcao}</Button>
            ))}
          </div>
        </div>
      )
    );
  };

  const renderMyShopContent = () => (
    <div>
      <h3 className="text-lg font-semibold mb-2">Configurações MyShop</h3>
      <p>Preço de Venda: R$ {formatPrice(produto.precoVenda)}</p>
      <p>Estoque Disponível: {produto.estoqueDisponivel || 0}</p>
      <div className="mt-4 space-y-2">
        <Button 
          onClick={handleVenderEmMyShop} 
          className={`w-full ${isSellingOnMyShop ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {isSellingOnMyShop ? (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Vendendo no MyShop
            </>
          ) : (
            'Vender em MyShop'
          )}
        </Button>
        {myShopUrl && (
          <Button variant="outline" onClick={copyMyShopUrl} className="w-full">
            Copiar URL da Loja
          </Button>
        )}
        {myShopUrl && (
          <Button variant="outline" onClick={() => window.open(myShopUrl, '_blank')} className="w-full">
            Ver Loja
          </Button>
        )}
      </div>
    </div>
  );

  const renderDefaultContent = () => (
    <div>
      <h3 className="text-lg font-semibold mb-2">Configurações para {activeMarketplace}</h3>
      <p>Configure as opções específicas para {activeMarketplace} aqui.</p>
    </div>
  );

  const renderMarketplaceSpecificContent = () => {
    switch (activeMarketplace) {
      case 'Fornecedor':
        return renderFornecedorContent();
      case 'MyShop':
        return renderMyShopContent();
      default:
        return renderDefaultContent();
    }
  };

  return (
    <div className="md:w-1/2">
      <h1 className="text-3xl font-bold mb-2">{produto.titulo}</h1>
      
      <div className="flex items-center mb-4">
        {renderStars(produto.avaliacao || 0).map((star, index) => (
          <StarIcon
            key={index}
            className={`w-5 h-5 ${star.filled ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-2 text-gray-600">({produto.numeroAvaliacoes || 0} avaliações)</span>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          {renderMarketplaceSpecificContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetails;