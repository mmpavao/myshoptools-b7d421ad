import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthProvider';
import firebaseOperations from '../firebase/firebaseOperations';
import Header from '../components/LandingPage/Header';
import FeatureSection from '../components/LandingPage/FeatureSection';
import ProductSection from '../components/LandingPage/ProductSection';
import IntegrationSection from '../components/LandingPage/IntegrationSection';
import SupportSection from '../components/LandingPage/SupportSection';
import LogisticsSection from '../components/LandingPage/LogisticsSection';
import TestimonialSection from '../components/LandingPage/TestimonialSection';
import CallToAction from '../components/LandingPage/CallToAction';
import Footer from '../components/LandingPage/Footer';
import PricingSection from '../components/Pricing/PricingSection';

const LandingPage = () => {
  const [settings, setSettings] = useState({
    title: 'Elevate seu negócio com nossa solução de alto impacto',
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

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    setSelectedPlan(null);
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Header settings={settings} fadeIn={fadeIn} handleCTAClick={handleCTAClick} />
      <animated.div style={fadeIn}>
        <FeatureSection settings={settings} />
        <ProductSection />
        <IntegrationSection />
        <PricingSection onSelectPlan={handleSelectPlan} />
        <SupportSection />
        <LogisticsSection />
        <TestimonialSection />
        <CallToAction handleCTAClick={handleCTAClick} />
      </animated.div>
      <Footer settings={settings} />
    </div>
  );
};

export default LandingPage;