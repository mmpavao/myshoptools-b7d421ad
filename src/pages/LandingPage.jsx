import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthProvider';
import firebaseOperations from '../firebase/firebaseOperations';
import { ChevronDown } from 'lucide-react';

const LandingPage = () => {
  const [myShopProducts, setMyShopProducts] = useState([]);
  const [settings, setSettings] = useState({
    title: 'Revolucione seu E-commerce com MyShopTools',
    subtitle: 'Potencialize suas vendas online com nossa plataforma all-in-one',
    ctaText: 'Comece Grátis Agora',
    bannerUrl: '/placeholder.svg',
    contactEmail: '',
    contactPhone: '',
    footerText: '© 2024 MyShopTools. Todos os direitos reservados.',
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 }
  });

  useEffect(() => {
    fetchLandPageSettings();
    if (user) {
      fetchMyShopProducts();
    }
  }, [user]);

  const fetchLandPageSettings = async () => {
    try {
      const landPageSettings = await firebaseOperations.getLandPageSettings();
      if (landPageSettings) {
        setSettings(prevSettings => ({ ...prevSettings, ...landPageSettings }));
      }
    } catch (error) {
      console.error("Erro ao buscar configurações da LandPage:", error);
    }
  };

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
    <div className="bg-gradient-to-b from-purple-600 to-indigo-800 min-h-screen text-white">
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <img src={settings.bannerUrl} alt="Banner" className="absolute w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <animated.div style={fadeIn} className="relative z-10 text-center px-4">
          <h1 className="text-6xl font-bold mb-6">{settings.title}</h1>
          <p className="text-2xl mb-8">{settings.subtitle}</p>
          <div className="space-x-4">
            <Button size="lg" className="bg-yellow-400 text-purple-900 hover:bg-yellow-300 transition-all duration-300" onClick={handleCTAClick}>
              {settings.ctaText}
            </Button>
            <Button size="lg" className="bg-transparent border-2 border-white hover:bg-white hover:text-purple-900 transition-all duration-300" onClick={handleCTAClick}>
              Saiba Mais
            </Button>
          </div>
        </animated.div>
        <ChevronDown className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce" size={40} />
      </header>

      <section className="py-20 bg-white text-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Produtos em Destaque</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {myShopProducts.map((product) => (
              <div key={product.id} className="bg-gray-100 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl">
                <img src={product.fotos[0]} alt={product.titulo} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.titulo}</h3>
                  <p className="text-gray-600 mb-4">{product.descricao.substring(0, 100)}...</p>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-300">Ver Detalhes</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Por que escolher MyShopTools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Integração Simplificada", description: "Conecte-se facilmente a múltiplos marketplaces e gerencie tudo em um só lugar." },
              { title: "Análise Inteligente", description: "Tome decisões baseadas em dados com nossas ferramentas avançadas de análise." },
              { title: "Suporte Personalizado", description: "Nossa equipe está sempre pronta para ajudar você a crescer seu negócio." }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-8 text-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300">
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-100 text-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Depoimentos de Clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { quote: "MyShopTools revolucionou minha forma de vender online. Minha produtividade aumentou em 200%!", author: "Maria S., Empreendedora" },
              { quote: "A facilidade de gerenciar múltiplos canais de venda é incrível. Recomendo a todos!", author: "João P., Lojista" }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
                <p className="text-xl mb-4 italic">"{testimonial.quote}"</p>
                <p className="font-semibold text-right">- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-purple-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Pronto para Impulsionar suas Vendas?</h2>
          <Button size="lg" className="bg-yellow-400 text-purple-900 hover:bg-yellow-300 transition-all duration-300" onClick={handleCTAClick}>
            Comece seu Teste Gratuito
          </Button>
        </div>
      </section>


      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>{settings.footerText}</p>
          {settings.contactEmail && <p>Email: {settings.contactEmail}</p>}
          {settings.contactPhone && <p>Telefone: {settings.contactPhone}</p>}
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
