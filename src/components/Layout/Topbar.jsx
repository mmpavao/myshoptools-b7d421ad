import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Topbar = ({ companyName, toggleSidebar }) => {
  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-50">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 mr-4 rounded-full hover:bg-gray-200 focus:outline-none"
          >
            <Menu size={24} />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none">
              {companyName || 'Selecione uma empresa'}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Empresas</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Empresa 1</DropdownMenuItem>
              <DropdownMenuItem>Empresa 2</DropdownMenuItem>
              <DropdownMenuItem>Adicionar nova empresa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <Bell size={24} />
          </button>
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt="User avatar" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Topbar;