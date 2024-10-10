import React from 'react';

const AboutVissa = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Sobre a Vissa Global Trade</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Visão Global da Empresa</h3>
            <p className="text-gray-600">
              A Vissa Global Trade é especializada em conectar mercados internacionais, 
              fornecendo os produtos mais quentes do momento para venda nos principais 
              marketplaces. Nossa expertise global nos permite oferecer soluções 
              inovadoras para vendedores e fornecedores em todo o mundo.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Centros de Distribuição e Escritórios</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Centros de Distribuição: Itajaí e São Paulo, Brasil</li>
              <li>Escritórios: Orlando (Flórida, EUA), Hong Kong (China), Espanha</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutVissa;