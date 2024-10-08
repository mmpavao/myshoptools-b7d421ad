import React from 'react';
import { Bell, Menu, User, FileText, Book, Code, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '../Auth/AuthProvider';

const Topbar = ({ companyName, toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-transparent h-14">
      <div className="flex items-center justify-between h-full px-3">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-gray-200 focus:outline-none"
          >
            <Menu size={20} />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="ml-3 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none">
              {companyName || 'Selecione uma empresa'}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Empresas</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Vissa Ecommerce</DropdownMenuItem>
              <DropdownMenuItem>Meubles Frire</DropdownMenuItem>
              <DropdownMenuItem>ColorFios</DropdownMenuItem>
              <DropdownMenuItem>Online Sales</DropdownMenuItem>
              <DropdownMenuItem>Adicionar nova empresa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <Bell size={24} />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none flex items-center">
              <Avatar className="ring-1 ring-gray-300">
                <AvatarImage src={user?.photoURL} alt="User avatar" />
                <AvatarFallback className="font-bold text-lg">
                  {user?.photoURL ? (
                    user.displayName?.[0] || 'U'
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
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
    </header>
  );
};

export default Topbar;
