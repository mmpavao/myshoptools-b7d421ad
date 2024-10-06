import React, { useState, useEffect } from 'react';
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
  List,
  Users,
  Settings,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../Auth/AuthProvider';
import { getUserRole } from '../../firebase/userOperations';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  {
    label: 'Vendedor',
    icon: Store,
    roles: ['Vendedor', 'Admin', 'Master'],
    children: [
      { icon: Store, label: 'Vitrine', to: '/vitrine' },
      { icon: ClipboardList, label: 'Meus Pedidos', to: '/meus-pedidos' },
      { icon: List, label: 'Meus Produtos', to: '/meus-produtos' },
    ],
  },
  {
    label: 'Fornecedor',
    icon: Box,
    roles: ['Fornecedor', 'Admin', 'Master'],
    children: [
      { icon: Package, label: 'Estoque', to: '/estoque' },
      { icon: ShoppingCart, label: 'Pedidos', to: '/pedidos-fornecedor' },
    ],
  },
  {
    label: 'Admin',
    icon: LayoutDashboard,
    roles: ['Admin', 'Master'],
    children: [
      { icon: Plug, label: 'Integrações', to: '/integracoes' },
      { icon: FileText, label: 'Logs de Integrações', to: '/admin/settings?tab=logs' },
      { icon: Users, label: 'Usuários', to: '/admin/users' },
      { icon: Settings, label: 'Configurações', to: '/admin/settings' },
      { icon: MessageSquare, label: 'Chat Admin', to: '/admin/chat' },
    ],
  },
];

const NavItem = ({ item, isOpen, userRole }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasAccess = item.roles ? item.roles.includes(userRole) : true;

  if (!hasAccess) {
    return null;
  }

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
              <NavItem key={child.to} item={child} isOpen={isOpen} userRole={userRole} />
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
  const { user } = useAuth();
  const [userRole, setUserRole] = useState('Vendedor');

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const role = await getUserRole(user.uid);
        setUserRole(role);
      }
    };
    fetchUserRole();
  }, [user]);

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-50 h-screen transition-all duration-300",
      isOpen ? "w-64" : "w-16",
      "bg-white text-gray-900 shadow-md"
    )}>
      <div className="h-full overflow-y-auto py-4 px-3">
        <div className={cn(
          "text-xl font-bold mb-6 text-center",
          !isOpen && "text-sm"
        )}>
          {isOpen ? "MyShopTools" : "MST"}
        </div>
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <NavItem key={index} item={item} isOpen={isOpen} userRole={userRole} />
          ))}
        </ul>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <NavLink
            to="/suporte"
            className={cn(
              "flex items-center p-2 text-base font-normal rounded-lg text-gray-900 hover:bg-gray-100",
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
