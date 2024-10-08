import React from 'react';
import { Bell, User, FileText, Book, Code, LogOut, ChevronDown, PanelLeftClose, PanelLeftOpen, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import Breadcrumb from '../ui/breadcrumb';

const Topbar = ({ companyName, toggleSidebar, isSidebarOpen, isMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-transparent">
      <div className="flex flex-col h-[4.2rem] px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {!isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-full hover:bg-gray-200 focus:outline-none mr-3"
              >
                {isSidebarOpen ? (
                  <PanelLeftClose size={28} className="text-gray-700" />
                ) : (
                  <PanelLeftOpen size={28} className="text-gray-700" />
                )}
              </button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-gray-800">{companyName}</span>
                  <ChevronDown className="ml-1 h-4 w-4 text-gray-600" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Empresa 1</DropdownMenuItem>
                <DropdownMenuItem>Empresa 2</DropdownMenuItem>
                <DropdownMenuItem>Empresa 3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center space-x-3 bg-white bg-opacity-80 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] px-2 py-1.5">
            <div className="relative flex items-center">
              <Search className="absolute left-2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Pesquisar..."
                className="w-56 bg-gray-100 border-none focus:ring-0 text-sm focus:outline-none pl-8 rounded-full h-9"
              />
            </div>
            <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
              <Bell size={20} />
            </button>
            {!isMobile && (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none flex items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.photoURL} alt="User avatar" />
                    <AvatarFallback className="font-bold text-sm">
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
            )}
          </div>
        </div>
        <div className="mt-2">
          <Breadcrumb />
        </div>
      </div>
    </header>
  );
};

export default Topbar;