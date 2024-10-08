import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthProvider';
import firebaseOperations from '../firebase/firebaseOperations';
import { ChevronDown, ShoppingCart, Globe, DollarSign, Store, BarChart2, Shield } from 'lucide-react';

const LandingPage = () => {
  const [settings, setSettings] = useState({
    title: 'A maior plataforma de dropshipping da América Latina',
    subtitle: 'Conectando vendedores e fornecedores em uma rede global de oportunidades',
    ctaText: 'Comece Grátis Agora',
    bannerUrl: '',
    contactEmail: '',
    contactPhone: '',
    footerText: '',
    activeVendors: '15.000+',
    countriesServed: '7+',
    competitivePricing: 'Encontre produtos com preços competitivos e margens atrativas para vender em marketplaces como Mercado Livre e outros.',
    readyToSellStore: 'Nossa loja própria está pronta para você começar a vender imediatamente, com diversas APIs para integração.',
    inventoryManagement: 'Gerencie seu estoque de forma eficiente com nossas ferramentas avançadas de controle de inventário.',
    secureTransactions: 'Garantimos transações seguras entre fornecedores e vendedores, protegendo seu negócio.',
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
  }, []);

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

  const handleCTAClick = () => {
    navigate('/register');
  };

  const renderFeatureSection = (icon, title, description) => (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
      {icon}
      <h3 className="mt-4 mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-center text-gray-600">{description}</p>
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-blue-600 to-purple-800 min-h-screen text-white">
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        {settings.bannerUrl ? (
          <img src={settings.bannerUrl} alt="Banner" className="absolute w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-800"></div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <animated.div style={fadeIn} className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{settings.title}</h1>
          <p className="text-xl md:text-2xl mb-8">{settings.subtitle}</p>
          <Button size="lg" className="bg-yellow-400 text-purple-900 hover:bg-yellow-300 transition-all duration-300" onClick={handleCTAClick}>
            {settings.ctaText}
          </Button>
        </animated.div>
        <ChevronDown className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce" size={40} />
      </header>

      <section className="py-20 bg-white text-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Por que escolher nossa plataforma?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {renderFeatureSection(<ShoppingCart size={48} className="text-blue-600" />, `${settings.activeVendors} Vendedores Ativos`, settings.competitivePricing)}
            {renderFeatureSection(<Globe size={48} className="text-blue-600" />, `Fornecedores em ${settings.countriesServed} países`, "Acesso a uma rede global de fornecedores confiáveis")}
            {renderFeatureSection(<DollarSign size={48} className="text-blue-600" />, "Preços Competitivos", settings.competitivePricing)}
            {renderFeatureSection(<Store size={48} className="text-blue-600" />, "Loja Pronta", settings.readyToSellStore)}
            {renderFeatureSection(<BarChart2 size={48} className="text-blue-600" />, "Gestão de Estoque", settings.inventoryManagement)}
            {renderFeatureSection(<Shield size={48} className="text-blue-600" />, "Transações Seguras", settings.secureTransactions)}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-100 text-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Depoimentos de Clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { quote: "Esta plataforma revolucionou meu negócio de dropshipping. Minha produtividade aumentou em 200%!", author: "Maria S., Empreendedora" },
              { quote: "A facilidade de gerenciar múltiplos canais de venda é incrível. Recomendo a todos!", author: "João P., Lojista" }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg">
                <p className="text-xl mb-4 italic">"{testimonial.quote}"</p>
                <p className="font-semibold text-right">- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Pronto para Impulsionar suas Vendas?</h2>
          <Button size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 transition-all duration-300" onClick={handleCTAClick}>
            Comece seu Teste Gratuito
          </Button>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">{settings.footerText}</p>
          <p>Contato: {settings.contactEmail} | {settings.contactPhone}</p>
          <p>&copy; {new Date().getFullYear()} MyShopTools. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;