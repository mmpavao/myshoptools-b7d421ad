import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingCart, Package, Truck, BarChart2, Settings, HelpCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '../Auth/AuthProvider';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();

  const sidebarItems = [
    { name: 'Dashboard', icon: <BarChart2 />, path: '/dashboard' },
    { name: 'Vitrine', icon: <Package />, path: '/vitrine' },
    { name: 'Meus Produtos', icon: <ShoppingCart />, path: '/meus-produtos' },
    { name: 'Meus Pedidos', icon: <Truck />, path: '/meus-pedidos' },
    { name: 'Configurações', icon: <Settings />, path: '/configuracoes' },
    { name: 'Suporte', icon: <HelpCircle />, path: '/suporte' },
  ];

  const marketplaces = [
    { name: 'MyShop', isActive: true },
    { name: 'Mercado Livre', isActive: false },
    { name: 'Shopee', isActive: true },
    { name: 'Amazon', isActive: false },
  ];

  return (
    <div className={`bg-gray-800 text-white h-screen fixed top-0 left-0 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} overflow-hidden`}>
      <div className="flex justify-between items-center p-4">
        <h2 className={`font-bold text-xl ${isOpen ? 'block' : 'hidden'}`}>MyShopTools</h2>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>
      <nav>
        <ul>
          {sidebarItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-4 hover:bg-gray-700 transition-colors ${
                    isActive ? 'bg-gray-700' : ''
                  }`
                }
              >
                {item.icon}
                <span className={`ml-4 ${isOpen ? 'block' : 'hidden'}`}>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {isOpen && (
        <div className="mt-8 p-4">
          <h3 className="font-semibold mb-2">Canais de Venda</h3>
          <ul>
            {marketplaces.map((marketplace) => (
              <li key={marketplace.name} className="flex items-center mb-2">
                <span className={`w-2 h-2 rounded-full mr-2 ${marketplace.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                {marketplace.name}
                {marketplace.isActive && <ShoppingCart className="ml-2 w-4 h-4 text-green-500" />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;