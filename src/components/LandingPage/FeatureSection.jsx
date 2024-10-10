import React from 'react';
import { ShoppingCart, Globe, DollarSign, Store, BarChart2, Shield } from 'lucide-react';

const FeatureSection = ({ settings }) => {
  const renderFeatureItem = (icon, title, description) => (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
      {icon}
      <h3 className="mt-4 mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-center text-gray-600">{description}</p>
    </div>
  );

  return (
    <section className="py-20 bg-white text-gray-800">
      <h2 className="text-4xl font-bold mb-12 text-center">Por que escolher nossa plataforma?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {renderFeatureItem(<ShoppingCart size={48} className="text-blue-600" />, `${settings.activeVendors} Vendedores Ativos`, settings.competitivePricing)}
        {renderFeatureItem(<Globe size={48} className="text-blue-600" />, `Fornecedores em ${settings.countriesServed} países`, "Acesso a uma rede global de fornecedores confiáveis")}
        {renderFeatureItem(<DollarSign size={48} className="text-blue-600" />, "Preços Competitivos", settings.competitivePricing)}
        {renderFeatureItem(<Store size={48} className="text-blue-600" />, "Loja Pronta", settings.readyToSellStore)}
        {renderFeatureItem(<BarChart2 size={48} className="text-blue-600" />, "Gestão de Estoque", settings.inventoryManagement)}
        {renderFeatureItem(<Shield size={48} className="text-blue-600" />, "Transações Seguras", settings.secureTransactions)}
      </div>
    </section>
  );
};

export default FeatureSection;