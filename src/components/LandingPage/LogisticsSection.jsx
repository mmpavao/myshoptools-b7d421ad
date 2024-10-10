import React from 'react';

const LogisticsSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Logística</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Entrega Rápida e Eficiente</h3>
            <p>Nossa rede de parceiros logísticos garante entregas rápidas e confiáveis em todo o país. Acompanhe suas encomendas em tempo real e ofereça uma experiência superior aos seus clientes.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Armazenamento Estratégico</h3>
            <p>Utilizamos centros de distribuição estrategicamente localizados para otimizar o tempo de entrega e reduzir custos. Seu estoque está sempre no lugar certo, na hora certa.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Integração com Marketplaces</h3>
            <p>Nossa plataforma se integra perfeitamente com os principais marketplaces, automatizando o processo de fulfillment e garantindo que seus pedidos sejam processados e enviados sem complicações.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Suporte Logístico Especializado</h3>
            <p>Conte com nossa equipe de especialistas em logística para resolver qualquer desafio. Oferecemos suporte personalizado para garantir que sua operação funcione sem problemas.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogisticsSection;
