import React from 'react';
import { Store, Zap, Users, BarChart2, DollarSign, Code } from 'lucide-react';

const IntegrationSection = () => (
  <>
    <section className="py-20 bg-blue-800 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Venda em Múltiplos Canais</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
          {['Mercado Livre', 'Shopify', 'Shopee', 'Amazon', 'WooCommerce'].map((channel) => (
            <div key={channel} className="flex flex-col items-center">
              <Store className="w-16 h-16 mb-4" />
              <h3 className="text-xl font-semibold">{channel}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
    <section className="py-20 bg-white text-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Integrações Poderosas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { name: 'OpenAI', icon: <Zap className="w-12 h-12 text-blue-600" />, description: 'IA para precificação e suporte' },
            { name: 'Hubspot CRM', icon: <Users className="w-12 h-12 text-orange-600" />, description: 'Gestão de relacionamento com clientes' },
            { name: 'Bling ERP', icon: <BarChart2 className="w-12 h-12 text-green-600" />, description: 'Gestão empresarial integrada' },
            { name: 'Mercado Pago', icon: <DollarSign className="w-12 h-12 text-blue-400" />, description: 'Processamento de pagamentos' },
            { name: 'Stripe', icon: <DollarSign className="w-12 h-12 text-purple-600" />, description: 'Pagamentos online globais' },
            { name: 'PayPal', icon: <DollarSign className="w-12 h-12 text-blue-800" />, description: 'Transações internacionais' },
            { name: 'Google Sheets', icon: <Code className="w-12 h-12 text-green-500" />, description: 'Integração com planilhas' },
            { name: 'APIs Personalizadas', icon: <Code className="w-12 h-12 text-gray-600" />, description: 'Integrações sob medida' },
          ].map((api) => (
            <div key={api.name} className="flex flex-col items-center text-center">
              {api.icon}
              <h3 className="text-xl font-semibold mt-4 mb-2">{api.name}</h3>
              <p className="text-sm">{api.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default IntegrationSection;