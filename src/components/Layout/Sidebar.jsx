import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Store,
  Package,
  ClipboardList,
  LifeBuoy,
  Plug,
  FileText,
  ChevronDown,
  ChevronRight,
  Box,
  ShoppingCart,
} from 'lucide-react';

const navItems = [
  {
    label: 'Vender',
    icon: Store,
    children: [
      { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
      { icon: Store, label: 'Vitrine', to: '/vitrine' },
      { icon: ClipboardList, label: 'Meus Pedidos', to: '/meus-pedidos' },
    ],
  },
  {
    label: 'Fornecedor',
    icon: Box,
    children: [
      { icon: Package, label: 'Estoque', to: '/estoque' },
      { icon: ShoppingCart, label: 'Pedidos', to: '/pedidos-fornecedor' },
    ],
  },
  {
    label: 'Admin',
    icon: LayoutDashboard,
    children: [
      { icon: Plug, label: 'Integrações', to: '/integracoes' },
      { icon: FileText, label: 'Logs', to: '/logs' },
    ],
  },
];

const NavItem = ({ item, isOpen }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (item.children) {
    return (
      <li>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "flex items-center w-full p-2 text-base font-normal rounded-lg text-gray-900 hover:bg-gray-100",
            !isOpen && "justify-center"
          )}
        >
          <item.icon className={cn("w-6 h-6", !isOpen && "mx-auto")} />
          {isOpen && (
            <>
              <span className="ml-3 flex-1 text-left whitespace-nowrap">{item.label}</span>
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </>
          )}
        </button>
        {isExpanded && isOpen && (
          <ul className="py-2 space-y-2">
            {item.children.map((child) => (
              <NavItem key={child.to} item={child} isOpen={isOpen} />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <NavLink
        to={item.to}
        className={({ isActive }) =>
          cn(
            "flex items-center p-2 text-base font-normal rounded-lg",
            isActive
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            !isOpen && "justify-center"
          )
        }
      >
        <item.icon className={cn("w-6 h-6", !isOpen && "mx-auto")} />
        {isOpen && <span className="ml-3">{item.label}</span>}
      </NavLink>
    </li>
  );
};

const Sidebar = ({ isOpen }) => {
  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen transition-all duration-300 pt-16",
      isOpen ? "w-64" : "w-16"
    )}>
      <div className="h-full overflow-y-auto bg-white border-r border-gray-200 py-4 px-3">
        <h1 className={cn(
          "text-xl font-bold text-gray-800 transition-opacity duration-300 mb-6",
          isOpen ? "opacity-100" : "opacity-0"
        )}>
          MyShopTools
        </h1>
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <NavItem key={index} item={item} isOpen={isOpen} />
          ))}
        </ul>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <NavLink
            to="/suporte"
            className={cn(
              "flex items-center p-2 text-base font-normal rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              !isOpen && "justify-center"
            )}
          >
            <LifeBuoy className={cn("w-6 h-6", !isOpen && "mx-auto")} />
            {isOpen && <span className="ml-3">Suporte</span>}
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
