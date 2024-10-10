import React from 'react';

const Footer = ({ settings }) => {
  return (
    <footer className="py-10 bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Contato</h3>
            <p>Email: {settings.contactEmail}</p>
            <p>Telefone: {settings.contactPhone}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Links Rápidos</h3>
            {/* Adicione links rápidos aqui */}
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Redes Sociais</h3>
            {/* Adicione links para redes sociais aqui */}
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>{settings.footerText}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;