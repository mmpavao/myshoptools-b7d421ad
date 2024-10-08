import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarIcon, Heart } from "lucide-react";

const ProdutoCard = ({ produto, onDetalhes, onImportar, isImportado, onExcluir, showExcluirButton = false }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const renderProductImage = (foto) => (
    <div className="w-full pb-[100%] relative overflow-hidden rounded-lg">
      <img 
        src={foto && foto.startsWith('http') ? foto : "/placeholder.svg"}
        alt={produto.titulo} 
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <button
        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md"
        onClick={(e) => {
          e.stopPropagation();
          setIsFavorite(!isFavorite);
        }}
      >
        <Heart
          className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
        />
      </button>
    </div>
  );

  const renderStars = (rating) => (
    [...Array(5)].map((_, index) => (
      <StarIcon key={index} className={`w-3 h-3 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
    ))
  );

  const formatPrice = (price) => (typeof price === 'number' ? price.toFixed(2) : '0.00');

  const calculateOldPrice = (currentPrice, discount) => {
    return currentPrice / (1 - discount / 100);
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardContent className="p-2 flex-grow flex flex-col justify-between">
        <h3 className="font-semibold text-sm line-clamp-2 mb-2">{produto.titulo}</h3>
        {renderProductImage(produto.fotos && produto.fotos[0])}
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between flex-wrap">
            <p className="text-sm font-bold text-primary">R$ {formatPrice(produto.preco)}</p>
            {produto.desconto > 0 && (
              <>
                <span className="text-xs text-gray-500 line-through">
                  R$ {formatPrice(calculateOldPrice(produto.preco, produto.desconto))}
                </span>
                <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">-{produto.desconto}%</span>
              </>
            )}
          </div>
          <p className="text-xs text-gray-600">Venda sugerida: R$ {formatPrice(produto.vendaSugerida)}</p>
          <div className="flex items-center">
            {renderStars(produto.avaliacao || 0)}
            <span className="ml-1 text-xs text-gray-600">({produto.numeroAvaliacoes || 0})</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-2 flex justify-between gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs flex-grow"
          onClick={() => onDetalhes(produto.id)}
        >
          Detalhes
        </Button>
        {showExcluirButton && isImportado ? (
          <Button 
            variant="destructive" 
            size="sm" 
            className="text-xs flex-grow"
            onClick={() => onExcluir(produto.id)}
          >
            Excluir
          </Button>
        ) : (
          <Button 
            variant="default" 
            size="sm" 
            className="text-xs flex-grow bg-primary hover:bg-primary/90"
            onClick={() => onImportar(produto.id)}
            disabled={isImportado}
          >
            {isImportado ? 'Importado' : 'Importar'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProdutoCard;