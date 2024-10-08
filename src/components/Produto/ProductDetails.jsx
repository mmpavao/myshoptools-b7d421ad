import React from 'react';
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProductDetails = ({ produto, isImportado, handleImportar }) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <StarIcon key={index} className={`w-5 h-5 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : '0.00';
  };

  const marketplaces = [
    'MyShop', 'Mercado Livre', 'Shopee', 'Amazon', 'Shopify', 'WooCommerce'
  ];

  return (
    <div className="md:w-1/2">
      <h1 className="text-3xl font-bold mb-2">{produto.titulo}</h1>
      <h2 className="text-xl text-gray-600 mb-4">{produto.sku}</h2>
      
      <Tabs defaultValue="MyShop" className="w-full mb-6">
        <TabsList className="grid grid-cols-3 gap-2 mb-4">
          {marketplaces.map((marketplace) => (
            <TabsTrigger key={marketplace} value={marketplace} className="text-xs">
              {marketplace}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {marketplaces.map((marketplace) => (
          <TabsContent key={marketplace} value={marketplace} className="mt-2">
            <Card>
              <CardContent className="pt-4">
                <h3 className="text-lg font-semibold mb-2">Configurações para {marketplace}</h3>
                <p className="text-sm text-gray-600">Aqui você pode adicionar configurações específicas para {marketplace}.</p>
                {/* Adicione campos de configuração específicos para cada marketplace aqui */}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="flex items-center mb-4">
        {renderStars(produto.avaliacao || 0)}
        <span className="ml-2 text-gray-600">({produto.numeroAvaliacoes || 0} avaliações)</span>
      </div>

      <div className="mb-4">
        <span className="text-3xl font-bold text-primary">R$ {formatPrice(produto.preco)}</span>
        {produto.desconto > 0 && (
          <>
            <span className="ml-2 text-gray-500 line-through">
              R$ {formatPrice(produto.preco / (1 - produto.desconto / 100))}
            </span>
            <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">-{produto.desconto}%</span>
          </>
        )}
      </div>

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

      <div className="mb-6">
        <Button 
          className="w-full" 
          onClick={handleImportar}
          disabled={isImportado}
        >
          {isImportado ? 'Adicionado' : 'Adicionar'}
        </Button>
      </div>
    </div>
  );
};

export default ProductDetails;