import React from 'react';
import { Bell, User, FileText, Book, Code, LogOut, ChevronDown, PanelLeftClose, PanelLeftOpen, Search } from 'lucide-react';
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
      <div className="flex items-center justify-between h-16 px-4"> {/* Changed h-14 to h-16 */}
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
        <div className="flex items-center space-x-3 bg-white bg-opacity-80 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] px-2 py-1.5"> {/* Increased py-1 to py-1.5 */}
          <div className="relative flex items-center">
            <Search className="absolute left-2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Pesquisar..."
              className="w-56 bg-gray-100 border-none focus:ring-0 text-sm focus:outline-none pl-8 rounded-full h-9" {/* Added h-9 to increase input height */}
            />
          </div>
          <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <Bell size={20} /> {/* Increased size from 18 to 20 */}
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none flex items-center">
              <Avatar className="h-8 w-8"> {/* Increased size from h-7 w-7 to h-8 w-8 */}
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
      <div className="px-4 py-2 bg-white bg-opacity-50 text-xs text-gray-600"> {/* Increased py-1.5 to py-2 */}
        {getBreadcrumbs()}
      </div>
    </header>
  );
};

export default Topbar;
