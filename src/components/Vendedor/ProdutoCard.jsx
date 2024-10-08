import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import RatingForm from '../Produto/RatingForm';

const ProdutoCard = ({ produto, onDetalhes, onAvaliar, avaliacaoAtual, setAvaliacaoAtual, handleSubmitAvaliacao }) => {
  const renderProductImage = (foto) => (
    <div className="aspect-square w-full overflow-hidden rounded-lg">
      <img 
        src={foto && foto.startsWith('http') ? foto : "/placeholder.svg"}
        alt="Produto" 
        className="w-full h-full object-cover"
      />
    </div>
  );

  const renderStars = (rating) => (
    [...Array(5)].map((_, index) => (
      <StarIcon key={index} className={`w-4 h-4 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
    ))
  );

  const formatPrice = (price) => (typeof price === 'number' ? price.toFixed(2) : '0.00');

  return (
    <Card className="flex flex-col w-[110%] h-[85%]"> {/* Aumentamos a largura em 10% e diminuímos a altura em 15% */}
      <CardHeader className="p-3"> {/* Reduzimos o padding */}
        <CardTitle className="text-lg line-clamp-2">{produto.titulo}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 flex-grow"> {/* Reduzimos o padding */}
        {renderProductImage(produto.fotos && produto.fotos[0])}
        <div className="mt-2 space-y-1"> {/* Reduzimos o espaçamento */}
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-primary">R$ {formatPrice(produto.preco)}</p>
            {produto.desconto > 0 && (
              <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">-{produto.desconto}%</span>
            )}
          </div>
          {produto.desconto > 0 && (
            <p className="text-xs text-gray-500 line-through">
              R$ {formatPrice(produto.preco / (1 - produto.desconto / 100))}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {renderStars(produto.avaliacao || 0)}
              <span className="ml-1 text-xs text-gray-600">({produto.numeroAvaliacoes || 0})</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 flex justify-between"> {/* Reduzimos o padding */}
        <Button variant="outline" size="sm" onClick={() => onDetalhes(produto.id)}>Detalhes</Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" onClick={() => onAvaliar(produto.id)}>Avaliar</Button>
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