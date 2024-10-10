import React from 'react';
import { animated } from 'react-spring';
import { Button } from "@/components/ui/button";
import { ChevronDown } from 'lucide-react';

const Header = ({ settings, fadeIn, handleCTAClick }) => (
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
);

export default Header;