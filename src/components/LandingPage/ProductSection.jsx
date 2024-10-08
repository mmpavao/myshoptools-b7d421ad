import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { StarIcon, Heart, ShoppingCart } from "lucide-react";
import firebaseOperations from '../../firebase/firebaseOperations';
import { useAuth } from '../../components/Auth/AuthProvider';
import MockCheckout from '../Checkout/MockCheckout';
import { formatCurrency } from '../../utils/currencyUtils';

const ProductSection = () => {
  const [produtos, setProdutos] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cart, setCart] = useState([]);
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

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    setCart([]); // Limpa o carrinho após fechar o checkout
  };

  const handleAddToCart = (produto) => {
    setCart([...cart, produto]);
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
        <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md">
          <Heart className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{produto.titulo}</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(produto.preco)}</p>
            {produto.desconto > 0 && (
              <div className="flex items-center">
                <span className="text-sm text-gray-500 line-through mr-1">
                  {formatCurrency(produto.preco / (1 - produto.desconto / 100))}
                </span>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">-{produto.desconto}%</span>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {renderStars(produto.avaliacao || 0)}
            <span className="ml-1 text-sm text-gray-600">({produto.numeroAvaliacoes || 0})</span>
          </div>
        </div>
        <Button onClick={() => handleAddToCart(produto)} className="w-full mt-4 bg-primary hover:bg-primary/90">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Adicionar ao Carrinho
        </Button>
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-gray-100 text-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-6 text-center">Loja Pronta - Preview</h2>
        <p className="text-center mb-12 text-lg">Experimente nossa loja pronta para uso. Adicione produtos ao carrinho e simule uma compra!</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {produtos.map(renderProductCard)}
        </div>
        <div className="mt-12 text-center">
          <Button onClick={() => setIsCheckoutOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-full">
            <ShoppingCart className="w-6 h-6 mr-2" />
            Finalizar Compra ({cart.length} itens)
          </Button>
        </div>
      </div>
      <MockCheckout
        isOpen={isCheckoutOpen}
        onClose={handleCloseCheckout}
        products={cart}
      />
    </section>
  );
};

export default ProductSection;