import React from 'react';
import { Button } from "@/components/ui/button";

const Banner = () => {
  return (
    <div className="relative h-screen">
      <img src="/path-to-your-image.jpg" alt="Global Trade" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Conectando Mercados Globais a Oportunidades Incríveis</h1>
        <div className="space-x-4">
          <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
            Conheça Nossa Plataforma
          </Button>
          <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
            Sobre a Vissa Global Trade
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Banner;