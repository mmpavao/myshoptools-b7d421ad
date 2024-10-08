import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Store, Package, ClipboardList, LifeBuoy,
  ShoppingCart, Users, Settings, MessageSquare, ChevronDown, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../Auth/AuthProvider';
import { getUserRole } from '../../firebase/userOperations';
import { Separator } from "@/components/ui/separator";

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  {
    label: 'Vendedor',
    roles: ['Vendedor', 'Admin', 'Master'],
    children: [
      { icon: Store, label: 'Vitrine', to: '/vitrine' },
      { icon: ClipboardList, label: 'Meus Pedidos', to: '/meus-pedidos' },
    ],
  },
  {
    label: 'Fornecedor',
    roles: ['Fornecedor', 'Admin', 'Master'],
    children: [
      { icon: Package, label: 'Estoque', to: '/estoque' },
      { icon: ShoppingCart, label: 'Pedidos', to: '/pedidos-fornecedor' },
    ],
  },
  {
    label: 'Admin',
    roles: ['Admin', 'Master'],
    children: [
      { icon: Users, label: 'Usuários', to: '/admin/users' },
      { icon: MessageSquare, label: 'Chat Admin', to: '/admin/chat' },
      { icon: Settings, label: 'Configurações', to: '/admin/settings' },
    ],
  },
];

const NavItem = ({ item, isOpen, userRole, isCollapsible, activeSection }) => {
  const [isExpanded, setIsExpanded] = useState(activeSection === item.label);
  const hasAccess = item.roles ? item.roles.includes(userRole) : true;
  const location = useLocation();

  if (!hasAccess) return null;

  const isActive = item.to === location.pathname || 
    (item.children && item.children.some(child => child.to === location.pathname));

  if (item.children) {
    return (
      <li>
        <div
          className={cn(
            "flex items-center w-full p-2 text-base font-semibold rounded-lg text-white",
            isOpen && "hover:bg-gray-800",
            !isOpen && "justify-center",
            isActive && "bg-gray-800"
          )}
          onClick={() => isCollapsible && setIsExpanded(!isExpanded)}
        >
          {isOpen && (
            <>
              <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>
              {isCollapsible && (isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
            </>
          )}
          {!isOpen && <span className="text-xs">{item.label[0]}</span>}
        </div>
        {(isExpanded || !isCollapsible) && isOpen && (
          <ul className="py-2 space-y-2 pl-4">
            {item.children.map((child) => (
              <NavItem key={child.to} item={child} isOpen={isOpen} userRole={userRole} isCollapsible={false} activeSection={activeSection} />
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
              ? "bg-gray-800 text-white"
              : "text-gray-300 hover:bg-gray-800 hover:text-white",
            !isOpen && "justify-center"
          )
        }
      >
        {item.icon && <item.icon className={cn("w-6 h-6", !isOpen && "mx-auto")} />}
        {isOpen && <span className="ml-3">{item.label}</span>}
      </NavLink>
    </li>
  );
};

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState('Vendedor');
  const [isCollapsible, setIsCollapsible] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const role = await getUserRole(user.uid);
        setUserRole(role);
      }
    };
    fetchUserRole();

    const handleResize = () => {
      const sidebarHeight = document.querySelector('aside').clientHeight;
      const totalItemsHeight = navItems.reduce((acc, item) => {
        return acc + (item.children ? (item.children.length + 1) * 40 : 40);
      }, 0);
      setIsCollapsible(totalItemsHeight > sidebarHeight - 300); // Increased threshold to 300px
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [user]);

  useEffect(() => {
    const currentSection = navItems.find(item => 
      item.to === location.pathname || 
      (item.children && item.children.some(child => child.to === location.pathname))
    );
    setActiveSection(currentSection ? currentSection.label : '');
  }, [location]);

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-50 h-screen transition-all duration-300",
      isOpen ? "w-64" : "w-20",
      "bg-gray-900 text-white shadow-md rounded-l-3xl m-2"
    )}>
      <div className="h-full overflow-y-auto py-6 px-3 flex flex-col">
        <div className={cn(
          "text-xl font-bold mb-6 text-center",
          !isOpen && "text-sm"
        )}>
          {isOpen ? "MyShopTools" : "MST"}
        </div>
        <ul className="space-y-2 flex-grow">
          {navItems.map((item, index) => (
            <React.Fragment key={index}>
              <NavItem 
                item={item} 
                isOpen={isOpen} 
                userRole={userRole} 
                isCollapsible={isCollapsible} 
                activeSection={activeSection}
              />
              {isOpen && index < navItems.length - 1 && <Separator className="my-2 bg-gray-700" />}
            </React.Fragment>
          ))}
        </ul>
        <div className="mt-auto pt-6">
          <NavLink
            to="/suporte"
            className={cn(
              "flex items-center p-2 text-base font-normal rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white",
              !isOpen && "justify-center"
            )}
          >
            <LifeBuoy className={cn("w-6 h-6", !isOpen && "mx-auto")} />
            {isOpen && <span className="ml-3">Suporte</span>}
          </NavLink>
        </div>
        {/* Add padding to the bottom of the sidebar */}
        <div className="pb-6"></div>
      </div>
    </aside>
  );
};

export default Sidebar;