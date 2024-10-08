import React from 'react';
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ProductDetails = ({ produto, activeMarketplace }) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <StarIcon key={index} className={`w-5 h-5 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : '0.00';
  };

  const renderMarketplaceSpecificContent = () => {
    switch (activeMarketplace) {
      case 'Fornecedor':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Informações do Fornecedor</h3>
            <p>SKU do Fornecedor: {produto.skuFornecedor || 'N/A'}</p>
            <p>Preço de Custo: R$ {formatPrice(produto.precoCusto)}</p>
          </div>
        );
      case 'MyShop':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Configurações MyShop</h3>
            <p>Preço de Venda: R$ {formatPrice(produto.precoVenda)}</p>
            <p>Estoque Disponível: {produto.estoqueDisponivel || 0}</p>
          </div>
        );
      // Adicione casos para outros marketplaces conforme necessário
      default:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Configurações para {activeMarketplace}</h3>
            <p>Configure as opções específicas para {activeMarketplace} aqui.</p>
          </div>
        );
    }
  };

  return (
    <div className="md:w-1/2">
      <h1 className="text-3xl font-bold mb-2">{produto.titulo}</h1>
      <h2 className="text-xl text-gray-600 mb-4">{produto.sku}</h2>
      
      <div className="flex items-center mb-4">
        {renderStars(produto.avaliacao || 0)}
        <span className="ml-2 text-gray-600">({produto.numeroAvaliacoes || 0} avaliações)</span>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          {renderMarketplaceSpecificContent()}
        </CardContent>
      </Card>

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
        <Button className="w-full">
          {activeMarketplace === 'Fornecedor' ? 'Atualizar Estoque' : `Publicar no ${activeMarketplace}`}
        </Button>
      </div>
    </div>
  );
};

export default ProductDetails;