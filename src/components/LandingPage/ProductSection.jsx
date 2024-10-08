import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
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
        setProdutos(produtosData.slice(0, 6)); // Limita a 6 produtos
      } else {
        const produtosData = await firebaseOperations.getProducts();
        setProdutos(produtosData.slice(0, 6)); // Limita a 6 produtos
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

  const renderProductCard = (produto) => (
    <div key={produto.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
      <img src={produto.fotos[0] || "/placeholder.svg"} alt={produto.titulo} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{produto.titulo}</h3>
        <p className="text-gray-600 mb-2 line-clamp-2">{produto.descricao}</p>
        <p className="text-blue-600 font-bold mb-4">R$ {produto.preco.toFixed(2)}</p>
        <div className="flex justify-center">
          <Button onClick={() => handleComprar(produto)}>Comprar</Button>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-gray-100 text-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Produtos em Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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