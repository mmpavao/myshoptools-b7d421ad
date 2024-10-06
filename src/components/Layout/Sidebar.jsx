import React from 'react';
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
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: Store, label: 'Vitrine', to: '/vitrine' },
  { icon: Package, label: 'Meus Produtos', to: '/produtos' },
  { icon: ClipboardList, label: 'Pedidos', to: '/pedidos' },
  { icon: LifeBuoy, label: 'Suporte', to: '/suporte' },
  { icon: Plug, label: 'Integrações', to: '/integracoes' },
  { icon: FileText, label: 'Logs', to: '/logs' },
];

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
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center p-2 text-base font-normal rounded-lg",
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )
                }
              >
                <item.icon className={cn("w-6 h-6", !isOpen && "mx-auto")} />
                {isOpen && <span className="ml-3">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;