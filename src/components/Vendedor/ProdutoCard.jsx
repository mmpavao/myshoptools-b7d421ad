import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import RatingForm from '../Produto/RatingForm';

const ProdutoCard = ({ produto, onDetalhes, onAvaliar, avaliacaoAtual, setAvaliacaoAtual, handleSubmitAvaliacao }) => {
  const renderProductImage = (foto) => (
    <div className="w-full pb-[100%] relative overflow-hidden rounded-lg">
      <img 
        src={foto && foto.startsWith('http') ? foto : "/placeholder.svg"}
        alt="Produto" 
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

  return (
    <Card className="w-full aspect-square flex flex-col">
      <CardHeader className="p-2 flex-shrink-0">
        <CardTitle className="text-sm line-clamp-1">{produto.titulo}</CardTitle>
      </CardHeader>
      <CardContent className="p-2 flex-grow flex flex-col justify-between">
        {renderProductImage(produto.fotos && produto.fotos[0])}
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-primary">R$ {formatPrice(produto.preco)}</p>
            {produto.desconto > 0 && (
              <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">-{produto.desconto}%</span>
            )}
          </div>
          {produto.desconto > 0 && (
            <p className="text-xs text-gray-500 line-through">
              R$ {formatPrice(produto.preco / (1 - produto.desconto / 100))}
            </p>
          )}
          <div className="flex items-center">
            {renderStars(produto.avaliacao || 0)}
            <span className="ml-1 text-xs text-gray-600">({produto.numeroAvaliacoes || 0})</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-2 flex justify-between flex-shrink-0">
        <Button variant="outline" size="sm" className="text-xs px-2 py-1" onClick={() => onDetalhes(produto.id)}>Detalhes</Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs px-2 py-1" onClick={() => onAvaliar(produto.id)}>Avaliar</Button>
          </DialogTrigger>
          <RatingForm 
            avaliacaoAtual={avaliacaoAtual}
            setAvaliacaoAtual={setAvaliacaoAtual}
            handleSubmitAvaliacao={handleSubmitAvaliacao}
          />
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default ProdutoCard;