import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthProvider';
import firebaseOperations from '../firebase/firebaseOperations';
import { ChevronDown, ShoppingCart, Globe, DollarSign, Store, BarChart2, Shield, Zap, Code, Headphones, Users, Truck } from 'lucide-react';
import PricingSection from '../components/Pricing/PricingSection';
import MockCheckout from '../components/Checkout/MockCheckout';
import Header from '../components/LandingPage/Header';
import FeatureSection from '../components/LandingPage/FeatureSection';
import ProductSection from '../components/LandingPage/ProductSection';
import IntegrationSection from '../components/LandingPage/IntegrationSection';
import SupportSection from '../components/LandingPage/SupportSection';
import LogisticsSection from '../components/LandingPage/LogisticsSection';
import TestimonialSection from '../components/LandingPage/TestimonialSection';
import CallToAction from '../components/LandingPage/CallToAction';
import Footer from '../components/LandingPage/Footer';

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
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
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

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    setSelectedPlan(null);
  };

  return (
    <div className="bg-gradient-to-b from-blue-600 to-purple-800 min-h-screen text-white">
      <Header settings={settings} fadeIn={fadeIn} handleCTAClick={handleCTAClick} />
      <FeatureSection settings={settings} />
      <ProductSection featuredProducts={settings.featuredProducts} />
      <PricingSection onSelectPlan={handleSelectPlan} />
      <IntegrationSection />
      <SupportSection />
      <LogisticsSection />
      <TestimonialSection />
      <CallToAction handleCTAClick={handleCTAClick} />
      <Footer settings={settings} />
      <MockCheckout isOpen={isCheckoutOpen} onClose={closeCheckout} plan={selectedPlan} />
    </div>
  );
};

export default LandingPage;