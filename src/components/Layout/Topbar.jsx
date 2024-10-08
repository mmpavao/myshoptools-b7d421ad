import React from 'react';
import { Bell, User, FileText, Book, Code, LogOut, ChevronDown, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '../Auth/AuthProvider';
import { Input } from "@/components/ui/input";

const Topbar = ({ companyName, toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    return paths.map((path, index) => (
      <React.Fragment key={index}>
        {index > 0 && <span className="mx-2 text-gray-400">/</span>}
        <span className="capitalize">{path}</span>
      </React.Fragment>
    ));
  };

  return (
    <header className="bg-transparent">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-full hover:bg-gray-200 focus:outline-none"
          >
            {isSidebarOpen ? (
              <PanelLeftClose size={24} />
            ) : (
              <PanelLeftOpen size={24} />
            )}
          </button>
          <span className="ml-3 text-base font-medium text-gray-700">{companyName}</span>
        </div>
        <div className="flex items-center space-x-3 bg-transparent rounded-full shadow-sm px-2 py-1">
          <Input
            type="search"
            placeholder="Pesquisar..."
            className="w-56 bg-transparent border-none focus:ring-0 text-sm focus:outline-none"
          />
          <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <Bell size={18} />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none flex items-center">
              <Avatar className="h-7 w-7">
                <AvatarImage src={user?.photoURL} alt="User avatar" />
                <AvatarFallback className="font-bold text-xs">
                  {user?.photoURL ? (
                    user.displayName?.[0] || 'U'
                  ) : (
                    <User className="h-3 w-3" />
                  )}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="ml-1 h-3 w-3 text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center p-2">
                <Avatar className="w-10 h-10 mr-2 ring-1 ring-gray-300">
                  <AvatarImage src={user?.photoURL || "/placeholder.svg"} alt="User avatar" />
                  <AvatarFallback>{user?.displayName?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.displayName || 'Usuário'}</span>
                  <span className="text-xs text-gray-500">{user?.email}</span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/logs')}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Logs</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/documentation')}>
                <Book className="mr-2 h-4 w-4" />
                <span>Documentação</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/apis')}>
                <Code className="mr-2 h-4 w-4" />
                <span>APIs</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="px-4 py-1.5 bg-white bg-opacity-50 text-xs text-gray-600">
        {getBreadcrumbs()}
      </div>
    </header>
  );
};

export default Topbar;
