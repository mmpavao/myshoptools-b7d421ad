import React from 'react';
import { animated } from 'react-spring';
import { Button } from '../ui/button';

const Header = ({ settings, fadeIn, handleCTAClick }) => {
  return (
    <animated.header style={fadeIn} className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">{settings.title}</h1>
      <p className="text-xl mb-8">{settings.subtitle}</p>
      <Button onClick={handleCTAClick} size="lg">{settings.ctaText}</Button>
    </animated.header>
  );
};

export default Header;