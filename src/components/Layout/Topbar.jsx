import React from 'react';
import { Bell, User, FileText, Book, Code, LogOut, Sun } from 'lucide-react';
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

const Topbar = ({ companyName, toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-10 relative">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="mr-2 text-gray-600 hover:text-gray-800"
          >
            {isSidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            )}
          </Button>
          <span className="text-lg font-semibold text-gray-800">{companyName}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Input
              type="search"
              placeholder="Pesquisar..."
              className="w-48 pl-8 pr-2 py-1 rounded-full bg-gray-100 text-gray-800 placeholder-gray-400 focus:bg-white transition-colors duration-200 text-sm border-none focus:outline-none"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 p-1">
            <Bell size={18} />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 p-1">
            <Sun size={18} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-7 w-7 rounded-full p-0">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user?.photoURL} alt="User avatar" />
                  <AvatarFallback>
                    {user?.displayName?.[0] || <User className="h-3 w-3" />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  {user?.displayName && <p className="font-medium">{user.displayName}</p>}
                  {user?.email && (
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  )}
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