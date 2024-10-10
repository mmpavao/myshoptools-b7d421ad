import React, { useState, useEffect } from 'react';
import Banner from './Banner';
import AboutVissa from './AboutVissa';
import SimplifiedLogistics from './SimplifiedLogistics';
import MyShopToolsSection from './MyShopToolsSection';
import IntegrationsPartnerships from './IntegrationsPartnerships';
import InteractiveMap from './InteractiveMap';
import Contact from './Contact';
import Footer from './Footer';
import firebaseOperations from '../../firebase/firebaseOperations';

const VissaGlobalTradePage = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const vissaSiteSettings = await firebaseOperations.getVissaSiteSettings();
        setSettings(vissaSiteSettings);
      } catch (error) {
        console.error("Erro ao buscar configurações do site Vissa:", error);
      }
    };
    fetchSettings();
  }, []);

  if (!settings) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Banner 
        title={settings.title}
        subtitle={settings.subtitle}
        backgroundImage={settings.bannerUrl}
      />
      <AboutVissa 
        description={settings.description}
        backgroundImage={settings.banners?.about}
      />
      <SimplifiedLogistics 
        backgroundImage={settings.banners?.logistics}
      />
      <MyShopToolsSection />
      <IntegrationsPartnerships 
        partnerLogos={settings.partnerLogos}
      />
      <InteractiveMap 
        mapIcons={settings.mapIcons}
      />
      <Contact 
        email={settings.contactEmail}
        phone={settings.contactPhone}
      />
      <Footer 
        logo={settings.logoUrl}
      />
    </div>
  );
};

export default VissaGlobalTradePage;