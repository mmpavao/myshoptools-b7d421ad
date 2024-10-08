import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Menu } from 'lucide-react';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [companyName, setCompanyName] = useState('Vissa Ecommerce');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {!isMobile && <Sidebar isOpen={isSidebarOpen} />}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${!isMobile && isSidebarOpen ? 'md:ml-[calc(15rem+0.75rem)]' : !isMobile ? 'md:ml-[calc(5rem+0.75rem)]' : ''}`}>
        <Topbar 
          companyName={companyName} 
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen}
          isMobile={isMobile}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-3">
          <div className="container mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
      {isMobile && (
        <Drawer>
          <DrawerTrigger asChild>
            <button className="fixed bottom-4 right-4 p-2 bg-primary text-white rounded-full shadow-lg">
              <Menu size={24} />
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <Sidebar isOpen={true} isMobile={true} />
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default Layout;