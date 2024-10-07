import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import LogViewer from '../LogViewer';
import { useAuth } from '../Auth/AuthProvider';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const isMasterUser = user?.role === 'Master';

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
        <LogViewer isMasterUser={isMasterUser} />
      </div>
    </div>
  );
};

export default Layout;