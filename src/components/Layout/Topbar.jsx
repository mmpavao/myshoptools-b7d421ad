import React from 'react';
import { Bell, Menu, User, FileText, Book, Code, LogOut, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '../Auth/AuthProvider';
import { useTheme } from 'next-themes';

const Topbar = ({ companyName, toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="bg-background h-16 border-b">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 mr-4 rounded-full hover:bg-accent focus:outline-none"
          >
            <Menu size={24} />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm font-medium text-foreground hover:text-foreground/80 focus:outline-none">
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
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <button className="text-foreground/80 hover:text-foreground focus:outline-none">
            <Bell size={24} />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Avatar>
                <AvatarImage src={user?.photoURL || "/placeholder.svg"} alt="User avatar" />
                <AvatarFallback>{user?.displayName?.[0] || 'U'}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center p-2">
                <Avatar className="w-10 h-10 mr-2">
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