import React from 'react';
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { renderStars, formatPrice, calculateOldPrice } from './productUtils';
import MyShopLandingPage from '../Vendedor/MyShopLandingPage';

const ProductDetails = ({ produto, activeMarketplace }) => {
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
      <MyShopLandingPage produtos={[produto]} />
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