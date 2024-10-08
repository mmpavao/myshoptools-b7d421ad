import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { LayoutDashboard, Store, ClipboardList, User, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [companyName, setCompanyName] = useState('Vissa Ecommerce');
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

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

  const MobileNavItem = ({ icon: Icon, label, to }) => (
    <button onClick={() => navigate(to)} className="flex flex-col items-center justify-center">
      <Icon className="h-6 w-6" />
      <span className="text-xs mt-1">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {!isMobile && <Sidebar isOpen={isSidebarOpen} />}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${!isMobile && (isSidebarOpen ? 'md:ml-[calc(15rem+0.75rem)]' : 'md:ml-[calc(5rem+0.75rem)]')}`}>
        <Topbar 
          companyName={companyName} 
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen}
          isMobile={isMobile}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-3">
          <div className="container mx-auto max-w-7xl pb-16 md:pb-0">
            {children}
          </div>
        </main>
        {isMobile && (
          <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-2 flex justify-around items-center">
            <MobileNavItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" />
            <MobileNavItem icon={Store} label="Vitrine" to="/vitrine" />
            <MobileNavItem icon={ClipboardList} label="Pedidos" to="/meus-pedidos" />
            <MobileNavItem icon={User} label="Perfil" to="/profile" />
          </nav>
        )}
      </div>
      {isMobile && (
        <Sheet>
          <SheetTrigger asChild>
            <button className="fixed top-4 left-4 p-2 bg-gray-900 text-white rounded-full">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col space-y-4 mt-8">
              <Sidebar isOpen={true} />
            </nav>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default Layout;