import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthProvider';
import firebaseOperations from '../firebase/firebaseOperations';

const LandingPage = () => {
  const [myShopProducts, setMyShopProducts] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchMyShopProducts();
    }
  }, [user]);

  const fetchMyShopProducts = async () => {
    try {
      const products = await firebaseOperations.getMyShopProducts(user.uid);
      setMyShopProducts(products);
    } catch (error) {
      console.error("Erro ao buscar produtos MyShop:", error);
    }
  };

  const handleCTAClick = () => {
    navigate('/register');
  };

  return (
    <div className="bg-gradient-to-b from-primary to-primary-foreground min-h-screen">
      <header className="container mx-auto py-16 text-center">
        <h1 className="text-5xl font-bold mb-4 text-white">Transforme seu Negócio com MyShopTools</h1>
        <p className="text-xl mb-8 text-white">A plataforma completa para impulsionar suas vendas online</p>
        <div className="space-x-4">
          <Button size="lg" className="bg-white text-primary hover:bg-gray-100" onClick={handleCTAClick}>
            Comece Agora Gratuitamente
          </Button>
          <Button size="lg" className="bg-secondary text-white hover:bg-secondary-dark" onClick={handleCTAClick}>
            Acesse Grátis por 14 Dias
          </Button>
        </div>
      </header>

      <section className="bg-white py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Produtos em Destaque</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {myShopProducts.map((product) => (
              <div key={product.id} className="bg-gray-100 p-4 rounded-lg">
                <img src={product.fotos[0]} alt={product.titulo} className="w-full h-48 object-cover mb-4 rounded" />
                <h3 className="text-xl font-semibold mb-2">{product.titulo}</h3>
                <p className="text-gray-600 mb-4">{product.descricao.substring(0, 100)}...</p>
                <Button className="w-full">Ver Detalhes</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Por que escolher MyShopTools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Integração Simplificada</h3>
              <p>Conecte-se facilmente a múltiplos marketplaces e gerencie tudo em um só lugar.</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Análise Inteligente</h3>
              <p>Tome decisões baseadas em dados com nossas ferramentas avançadas de análise.</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Suporte Personalizado</h3>
              <p>Nossa equipe está sempre pronta para ajudar você a crescer seu negócio.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Depoimentos de Clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="mb-4">"MyShopTools revolucionou minha forma de vender online. Minha produtividade aumentou em 200%!"</p>
              <p className="font-semibold">- Maria S., Empreendedora</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="mb-4">"A facilidade de gerenciar múltiplos canais de venda é incrível. Recomendo a todos!"</p>
              <p className="font-semibold">- João P., Lojista</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Pronto para Impulsionar suas Vendas?</h2>
          <Button size="lg" className="bg-primary text-white hover:bg-primary-dark" onClick={handleCTAClick}>
            Comece seu Teste Gratuito
          </Button>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 MyShopTools. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;