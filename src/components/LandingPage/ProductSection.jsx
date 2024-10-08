import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";
import firebaseOperations from '../../firebase/firebaseOperations';
import { useAuth } from '../../components/Auth/AuthProvider';
import MockCheckout from '../Checkout/MockCheckout';

const ProductSection = () => {
  const [produtos, setProdutos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchProdutos();
  }, [user]);

  const fetchProdutos = async () => {
    try {
      if (user) {
        const produtosData = await firebaseOperations.getMeusProdutos(user.uid);
        setProdutos(produtosData.slice(0, 5)); // Limita a 5 produtos
      } else {
        const produtosData = await firebaseOperations.getProducts();
        setProdutos(produtosData.slice(0, 5)); // Limita a 5 produtos
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const handleComprar = (produto) => {
    setSelectedProduct(produto);
    setIsCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    setSelectedProduct(null);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        className={`w-4 h-4 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const renderProductCard = (produto) => (
    <div key={produto.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
      <div className="relative pb-[100%]">
        <img 
          src={produto.fotos[0] || "/placeholder.svg"} 
          alt={produto.titulo} 
          className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
        />
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{produto.titulo}</h3>
          <div className="flex items-center mb-2">
            {renderStars(produto.avaliacao || 0)}
            <span className="ml-1 text-sm text-gray-600">({produto.numeroAvaliacoes || 0})</span>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-2xl font-bold text-blue-600">R$ {produto.preco.toFixed(2)}</p>
            {produto.desconto > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">-{produto.desconto}%</span>
            )}
          </div>
          {produto.desconto > 0 && (
            <p className="text-sm text-gray-500 line-through mb-1">
              R$ {(produto.preco / (1 - produto.desconto / 100)).toFixed(2)}
            </p>
          )}
          <p className="text-sm text-gray-500 mb-4">Venda sugerida: R$ {produto.vendaSugerida.toFixed(2)}</p>
          <Button 
            onClick={() => handleComprar(produto)} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Comprar
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Produtos em Destaque</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {produtos.map(renderProductCard)}
        </div>
      </div>
      {selectedProduct && (
        <MockCheckout
          isOpen={isCheckoutOpen}
          onClose={handleCloseCheckout}
          product={selectedProduct}
        />
      )}
    </section>
  );
};

export default ProductSection;