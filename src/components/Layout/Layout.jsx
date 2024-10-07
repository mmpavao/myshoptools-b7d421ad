import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import LogViewer from '../LogViewer';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
        <LogViewer />
      </div>
    </div>
  );
};

export default Layout;