import React from 'react';
import { Truck } from 'lucide-react';

const LogisticsSection = () => (
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
);

export default LogisticsSection;