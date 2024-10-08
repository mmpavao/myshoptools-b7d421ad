import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";
import { formatCurrency } from '@/utils/currencyUtils';
import { AspectRatio } from "@/components/ui/aspect-ratio";

const ProdutoCard = ({ produto, onDetalhes }) => {
  const renderProductImage = (foto) => (
    <AspectRatio ratio={1 / 1} className="bg-muted">
      <img 
        src={foto && foto.startsWith('http') ? foto : "/placeholder.svg"}
        alt={produto.titulo} 
        className="rounded-t-lg object-cover w-full h-full"
      />
    </AspectRatio>
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
    <div className="w-[120%] mx-auto"> {/* Aumentamos a largura em 20% e centralizamos */}
      <Card className="w-full flex flex-col overflow-hidden">
        {renderProductImage(produto.fotos && produto.fotos[0])}
        <CardContent className="p-3 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-sm line-clamp-2 mb-1">{produto.titulo}</h3>
            <div className="flex items-center space-x-1 text-xs mb-2">
              {renderStars(produto.avaliacao || 0)}
              <span className="text-gray-600">({produto.numeroAvaliacoes || 0})</span>
            </div>
          </div>
          <div className="mt-auto">
            <div className="flex items-baseline space-x-2 flex-wrap">
              <span className="text-lg font-bold text-primary">{formatCurrency(produto.preco)}</span>
              {produto.desconto > 0 && (
                <>
                  <span className="text-sm text-gray-500 line-through">{formatCurrency(originalPrice)}</span>
                  <span className="text-xs bg-red-500 text-white px-1 py-0.5 rounded">-{produto.desconto}%</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-3 pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full" 
            onClick={() => onDetalhes(produto.id)}
          >
            Detalhes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProdutoCard;