import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";
import { formatCurrency } from '@/utils/currencyUtils';
import { AspectRatio } from "@/components/ui/aspect-ratio";

const ProdutoCard = ({ produto, onDetalhes }) => {
  const renderProductImage = (foto) => (
    <AspectRatio ratio={4/3} className="bg-muted">
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
    <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {renderProductImage(produto.fotos && produto.fotos[0])}
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2">{produto.titulo}</h3>
        <div className="flex items-center space-x-1 mb-2">
          {renderStars(produto.avaliacao || 0)}
          <span className="text-sm text-gray-600">({produto.numeroAvaliacoes || 0})</span>
        </div>
        <div className="flex items-baseline space-x-2 flex-wrap mb-4">
          <span className="text-2xl font-bold text-primary">{formatCurrency(produto.preco)}</span>
          {produto.desconto > 0 && (
            <>
              <span className="text-sm text-gray-500 line-through">{formatCurrency(originalPrice)}</span>
              <span className="text-sm bg-red-500 text-white px-2 py-0.5 rounded-full">-{produto.desconto}%</span>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          variant="default"
          size="sm" 
          className="w-full" 
          onClick={() => onDetalhes(produto.id)}
        >
          Ver detalhes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProdutoCard;