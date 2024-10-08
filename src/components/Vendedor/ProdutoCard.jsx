import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";

const ProdutoCard = ({ produto, onDetalhes }) => {
  const renderProductImage = (foto) => (
    <div className="w-full aspect-square relative overflow-hidden rounded-lg">
      <img 
        src={foto && foto.startsWith('http') ? foto : "/placeholder.svg"}
        alt={produto.titulo} 
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
    </div>
  );

  const renderStars = (rating) => (
    [...Array(5)].map((_, index) => (
      <StarIcon key={index} className={`w-3 h-3 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
    ))
  );

  const formatPrice = (price) => (typeof price === 'number' ? price.toFixed(2) : '0.00');

  const originalPrice = produto.desconto > 0
    ? produto.preco / (1 - produto.desconto / 100)
    : produto.preco;

  return (
    <Card className="w-full h-full flex flex-col max-h-[300px] min-h-[250px]">
      <CardContent className="p-3 flex-grow flex flex-col justify-between">
        {renderProductImage(produto.fotos && produto.fotos[0])}
        <div className="mt-3 space-y-2">
          <h3 className="font-semibold text-sm line-clamp-2">{produto.titulo}</h3>
          <div className="flex items-center space-x-2 flex-wrap">
            {produto.desconto > 0 && (
              <>
                <span className="text-xs text-gray-500 line-through">R$ {formatPrice(originalPrice)}</span>
                <span className="text-xs text-red-600 font-bold">-{produto.desconto}%</span>
              </>
            )}
            <p className="text-sm font-bold text-primary">R$ {formatPrice(produto.preco)}</p>
          </div>
          <div className="flex items-center">
            {renderStars(produto.avaliacao || 0)}
            <span className="ml-1 text-xs text-gray-600">({produto.numeroAvaliacoes || 0})</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3">
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