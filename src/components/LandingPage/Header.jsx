import React from 'react';
import { animated } from 'react-spring';
import { Button } from '../ui/button';

const Header = ({ settings, fadeIn, handleCTAClick }) => {
  return (
    <animated.header style={fadeIn} className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-indigo-900"></div>
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          {settings.title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-300">{settings.subtitle}</p>
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300" 
          onClick={handleCTAClick}
        >
          {settings.ctaText}
        </Button>
      </div>
    </animated.header>
  );
};

export default Header;