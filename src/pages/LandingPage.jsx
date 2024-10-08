import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthProvider';
import firebaseOperations from '../firebase/firebaseOperations';
import { motion } from "framer-motion";
import { ShoppingCart, Star, BarChart2, Zap } from "lucide-react";

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

  const FeatureCard = ({ icon, title, description }) => (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-lg"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {icon}
      <h3 className="text-xl font-semibold mb-2 mt-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );

  return (
    <div className="bg-gradient-to-b from-blue-600 to-indigo-900 min-h-screen text-white">
      <header className="container mx-auto py-20 text-center">
        <motion.h1 
          className="text-6xl font-bold mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Revolucione seu E-commerce com MyShopTools
        </motion.h1>
        <motion.p 
          className="text-2xl mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Potencialize suas vendas, simplifique a gestão e conquiste o sucesso online
        </motion.p>
        <motion.div 
          className="space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-100 transition-colors duration-300" onClick={handleCTAClick}>
            Comece Agora Gratuitamente
          </Button>
          <Button size="lg" className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 transition-colors duration-300" onClick={handleCTAClick}>
            Teste Grátis por 14 Dias
          </Button>
        </motion.div>
      </header>

      <section className="py-20 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Produtos em Destaque</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {myShopProducts.map((product) => (
              <motion.div 
                key={product.id} 
                className="bg-white rounded-lg overflow-hidden shadow-lg"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img src={product.fotos[0]} alt={product.titulo} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{product.titulo}</h3>
                  <p className="text-gray-600 mb-4">{product.descricao.substring(0, 100)}...</p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300">Ver Detalhes</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Por que escolher MyShopTools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShoppingCart className="w-12 h-12 text-blue-600" />}
              title="Integração Simplificada"
              description="Conecte-se facilmente a múltiplos marketplaces e gerencie tudo em um só lugar."
            />
            <FeatureCard 
              icon={<BarChart2 className="w-12 h-12 text-blue-600" />}
              title="Análise Inteligente"
              description="Tome decisões baseadas em dados com nossas ferramentas avançadas de análise."
            />
            <FeatureCard 
              icon={<Zap className="w-12 h-12 text-blue-600" />}
              title="Suporte Personalizado"
              description="Nossa equipe está sempre pronta para ajudar você a crescer seu negócio."
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Depoimentos de Clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TestimonialCard 
              quote="MyShopTools revolucionou minha forma de vender online. Minha produtividade aumentou em 200%!"
              author="Maria S., Empreendedora"
            />
            <TestimonialCard 
              quote="A facilidade de gerenciar múltiplos canais de venda é incrível. Recomendo a todos!"
              author="João P., Lojista"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-700">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Pronto para Impulsionar suas Vendas?</h2>
          <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-100 transition-colors duration-300" onClick={handleCTAClick}>
            Comece seu Teste Gratuito
          </Button>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 MyShopTools. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

const TestimonialCard = ({ quote, author }) => (
  <motion.div 
    className="bg-gray-100 p-6 rounded-lg shadow-lg"
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Star className="w-8 h-8 text-yellow-400 mb-4" />
    <p className="text-gray-800 mb-4 text-lg italic">"{quote}"</p>
    <p className="font-semibold text-gray-700">- {author}</p>
  </motion.div>
);

export default LandingPage;