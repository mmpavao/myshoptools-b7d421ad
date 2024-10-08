import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthProvider';
import firebaseOperations from '../firebase/firebaseOperations';
import { ChevronDown, ShoppingCart, Globe, DollarSign, Store, BarChart2, Shield, Zap, Code, Headphones, Users, Truck } from 'lucide-react';

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
    featuredProducts: [],
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
    fetchFeaturedProducts();
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

  const fetchFeaturedProducts = async () => {
    try {
      const products = await firebaseOperations.getFeaturedProducts();
      setSettings(prevSettings => ({ ...prevSettings, featuredProducts: products }));
    } catch (error) {
      console.error("Erro ao buscar produtos em destaque:", error);
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

  const renderProductCard = (product) => (
    <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
      <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-2">{product.description}</p>
        <p className="text-blue-600 font-bold">R$ {product.price.toFixed(2)}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-blue-600 to-purple-800 min-h-screen text-white">
      {/* Header Section */}
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

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white text-gray-800">
        <h2 className="text-4xl font-bold mb-12 text-center">Por que escolher nossa plataforma?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {renderFeatureSection(<ShoppingCart size={48} className="text-blue-600" />, `${settings.activeVendors} Vendedores Ativos`, settings.competitivePricing)}
          {renderFeatureSection(<Globe size={48} className="text-blue-600" />, `Fornecedores em ${settings.countriesServed} países`, "Acesso a uma rede global de fornecedores confiáveis")}
          {renderFeatureSection(<DollarSign size={48} className="text-blue-600" />, "Preços Competitivos", settings.competitivePricing)}
          {renderFeatureSection(<Store size={48} className="text-blue-600" />, "Loja Pronta", settings.readyToSellStore)}
          {renderFeatureSection(<BarChart2 size={48} className="text-blue-600" />, "Gestão de Estoque", settings.inventoryManagement)}
          {renderFeatureSection(<Shield size={48} className="text-blue-600" />, "Transações Seguras", settings.secureTransactions)}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gray-100 text-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Produtos em Destaque</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {settings.featuredProducts.map(renderProductCard)}
          </div>
        </div>
      </section>

      {/* Multi-Channel Sales Section */}
      <section className="py-20 bg-blue-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Venda em Múltiplos Canais</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            {['Mercado Livre', 'Shopify', 'Shopee', 'Amazon', 'WooCommerce'].map((channel) => (
              <div key={channel} className="flex flex-col items-center">
                <Store className="w-16 h-16 mb-4" />
                <h3 className="text-xl font-semibold">{channel}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Integrations Section */}
      <section className="py-20 bg-white text-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Integrações Poderosas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'OpenAI', icon: <Zap className="w-12 h-12 text-blue-600" />, description: 'IA para precificação e suporte' },
              { name: 'Hubspot CRM', icon: <Users className="w-12 h-12 text-orange-600" />, description: 'Gestão de relacionamento com clientes' },
              { name: 'Bling ERP', icon: <BarChart2 className="w-12 h-12 text-green-600" />, description: 'Gestão empresarial integrada' },
              { name: 'Mercado Pago', icon: <DollarSign className="w-12 h-12 text-blue-400" />, description: 'Processamento de pagamentos' },
              { name: 'Stripe', icon: <DollarSign className="w-12 h-12 text-purple-600" />, description: 'Pagamentos online globais' },
              { name: 'PayPal', icon: <DollarSign className="w-12 h-12 text-blue-800" />, description: 'Transações internacionais' },
              { name: 'Google Sheets', icon: <Code className="w-12 h-12 text-green-500" />, description: 'Integração com planilhas' },
              { name: 'APIs Personalizadas', icon: <Code className="w-12 h-12 text-gray-600" />, description: 'Integrações sob medida' },
            ].map((api) => (
              <div key={api.name} className="flex flex-col items-center text-center">
                {api.icon}
                <h3 className="text-xl font-semibold mt-4 mb-2">{api.name}</h3>
                <p className="text-sm">{api.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Support Section */}
      <section className="py-20 bg-gray-100 text-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Suporte ao Cliente de Excelência</h2>
          <div className="flex justify-center items-center mb-8">
            <Headphones className="w-24 h-24 text-blue-600" />
          </div>
          <p className="text-xl mb-8">Nossa equipe de suporte está disponível 24/7 para ajudar você em todas as etapas do seu negócio.</p>
          <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">Fale Conosco</Button>
        </div>
      </section>

      {/* Logistics Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Logística Simplificada</h2>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <Truck className="w-32 h-32 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4 text-center">Entrega Rápida e Eficiente</h3>
              <p className="text-center">Nossos parceiros logísticos garantem que seus produtos cheguem rapidamente aos clientes, aumentando a satisfação e as vendas.</p>
            </div>
            <div className="md:w-1/2">
              <ul className="list-disc list-inside text-lg">
                <li>Integração com múltiplas transportadoras</li>
                <li>Rastreamento em tempo real</li>
                <li>Cálculo automático de frete</li>
                <li>Gestão de devoluções simplificada</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-100 text-gray-800">
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
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Pronto para Impulsionar suas Vendas?</h2>
          <Button size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 transition-all duration-300" onClick={handleCTAClick}>
            Comece seu Teste Gratuito
          </Button>
        </div>
      </section>

      {/* Footer */}
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
