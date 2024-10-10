import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400">MyShopTools</a></li>
              <li><a href="#" className="hover:text-blue-400">Sobre</a></li>
              <li><a href="#" className="hover:text-blue-400">Contato</a></li>
              <li><a href="#" className="hover:text-blue-400">Integrações</a></li>
              <li><a href="#" className="hover:text-blue-400">Política de Privacidade</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">MyShopTools</h3>
            <p className="mb-4">Explore nossa plataforma completa para e-commerce e dropshipping.</p>
            <a href="#" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">Acessar Plataforma</a>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400">Instagram</a>
              <a href="#" className="hover:text-blue-400">LinkedIn</a>
              <a href="#" className="hover:text-blue-400">Facebook</a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="mb-4">Fique por dentro das novidades e atualizações.</p>
            <form className="flex">
              <input type="email" placeholder="Seu email" className="flex-grow px-3 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition duration-300">Assinar</button>
            </form>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; 2024 Vissa Global Trade. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;