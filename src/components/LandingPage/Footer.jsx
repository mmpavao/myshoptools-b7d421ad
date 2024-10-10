import React from 'react';

const Footer = ({ settings }) => (
  <footer className="bg-gray-900 text-white py-8">
    <div className="container mx-auto px-4 text-center">
      <p className="mb-4">{settings.footerText}</p>
      <p>Contato: {settings.contactEmail} | {settings.contactPhone}</p>
      <p>&copy; {new Date().getFullYear()} MyShopTools. Todos os direitos reservados.</p>
    </div>
  </footer>
);

export default Footer;