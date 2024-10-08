import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";
import { formatCurrency } from '@/utils/currencyUtils';

const ProdutoCard = ({ produto, onDetalhes }) => {
  const renderProductImage = (foto) => (
    <div className="w-full h-0 pb-[100%] relative overflow-hidden">
      <img 
        src={foto && foto.startsWith('http') ? foto : "/placeholder.svg"}
        alt={produto.titulo} 
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );

  const renderStars = (rating) => (
    [...Array(5)].map((_, index) => (
      <StarIcon key={index} className={`w-3 h-3 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
    ))
  );

  const originalPrice = produto.desconto > 0
    ? produto.preco / (1 - produto.desconto / 100)
    : produto.preco;

  return (
    <Card className="w-full aspect-square flex flex-col overflow-hidden">
      <div className="h-1/2">
        {renderProductImage(produto.fotos && produto.fotos[0])}
      </div>
      <CardContent className="p-2 flex-grow flex flex-col justify-between h-1/2">
        <div>
          <h3 className="font-semibold text-sm line-clamp-2 mb-1">{produto.titulo}</h3>
          <div className="flex items-center space-x-1 text-xs mb-1">
            {renderStars(produto.avaliacao || 0)}
            <span className="text-gray-600">({produto.numeroAvaliacoes || 0})</span>
          </div>
        </div>
        <div className="mt-auto">
          <div className="flex flex-col items-start space-y-1">
            {produto.desconto > 0 && (
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-gray-500 line-through">{formatCurrency(originalPrice)}</span>
                <span className="bg-red-500 text-white px-1 py-0.5 rounded">-{produto.desconto}%</span>
              </div>
            )}
            <span className="text-sm font-bold text-primary">{formatCurrency(produto.preco)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-2 mt-auto">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs" 
          onClick={() => onDetalhes(produto.id)}
        >
          Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProdutoCard;