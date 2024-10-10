import React from 'react';

const SupportSection = () => {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Suporte</h2>
        <p className="text-lg text-center mb-6">
          Nossa equipe de suporte está disponível 24/7 para ajudar você com qualquer dúvida ou problema.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center">
          <div className="md:w-1/3 p-4">
            <h3 className="text-xl font-semibold mb-2">Chat ao Vivo</h3>
            <p>Converse com um de nossos representantes em tempo real.</p>
          </div>
          <div className="md:w-1/3 p-4">
            <h3 className="text-xl font-semibold mb-2">E-mail</h3>
            <p>Envie suas perguntas para suporte@vissaglobaltrade.com</p>
          </div>
          <div className="md:w-1/3 p-4">
            <h3 className="text-xl font-semibold mb-2">Telefone</h3>
            <p>Entre em contato pelo número (11) 1234-5678</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
