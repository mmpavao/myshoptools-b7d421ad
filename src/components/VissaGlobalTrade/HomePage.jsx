import React from 'react';
import Banner from './Banner';
import InteractiveMap from './InteractiveMap';
import Highlights from './Highlights';
import AboutVissa from './AboutVissa';
import MyShopToolsSection from './MyShopToolsSection';
import ForSuppliers from './ForSuppliers';
import IntegrationsPartnerships from './IntegrationsPartnerships';
import SimplifiedLogistics from './SimplifiedLogistics';
import Contact from './Contact';
import Footer from './Footer';

const HomePage = () => {
  return (
    <div className="vissa-global-trade">
      <Banner />
      <InteractiveMap />
      <Highlights />
      <AboutVissa />
      <MyShopToolsSection />
      <ForSuppliers />
      <IntegrationsPartnerships />
      <SimplifiedLogistics />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomePage;