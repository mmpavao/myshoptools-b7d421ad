import React from 'react';
import { Bell, User, Search, Moon, Sun, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAuth } from '../Auth/AuthProvider';
import { useTheme } from 'next-themes';

const Topbar = ({ companyName, toggleSidebar, isSidebarOpen }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
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
        <div className="flex items-center space-x-2 bg-gray-100 rounded-full shadow-sm px-3 py-1.5">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Pesquisar..."
              className="w-56 bg-transparent border-none focus:ring-0 text-sm pl-8 focus:outline-none"
            />
          </div>
          <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <Bell size={18} />
          </button>
          <button onClick={toggleTheme} className="text-gray-500 hover:text-gray-700 focus:outline-none">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <Avatar className="h-8 w-8 cursor-pointer" onClick={() => navigate('/profile')}>
            <AvatarImage src={user?.photoURL} alt="User avatar" />
            <AvatarFallback className="font-bold text-xs">
              {user?.photoURL ? (
                user.displayName?.[0] || 'U'
              ) : (
                <User className="h-4 w-4" />
              )}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Topbar;