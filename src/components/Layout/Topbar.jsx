import React from 'react';
import { Bell, User, FileText, Book, Code, LogOut, ChevronDown, PanelLeftClose, PanelLeftOpen, Search, Sun, Moon } from 'lucide-react';
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
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

const Topbar = ({ companyName, toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const companies = [
    "Vissa Ecommerce",
    "Online Sales",
    "Colorfions",
    "My Perfum",
    "D&V Commerce"
  ];

  return (
    <header className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} transition-colors duration-200`}>
      <div className="flex items-center justify-between h-[4.2rem] px-4">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} focus:outline-none mr-3`}
          >
            {isSidebarOpen ? (
              <PanelLeftClose size={28} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} />
            ) : (
              <PanelLeftOpen size={28} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} />
            )}
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="flex items-center">
                <span className="text-lg font-semibold">{companyName}</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {companies.map((company, index) => (
                <DropdownMenuItem key={index}>{company}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className={`flex items-center space-x-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] px-2 py-1.5`}>
          <div className="relative flex items-center">
            <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquisar..."
              className={`w-56 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} border-none focus:ring-0 text-sm focus:outline-none pl-8 rounded-full h-9`}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
          <Button variant="ghost" size="icon" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
            <Bell size={20} />
          </Button>
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
              <ChevronDown className="ml-1 h-4 w-4" />
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