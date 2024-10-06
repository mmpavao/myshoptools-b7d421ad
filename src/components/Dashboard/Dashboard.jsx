import React, { useState } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { Button } from '../ui/button';
import { testFirebaseOperations } from '../../firebase/firebaseOperations';
import FirebaseTestLog from './FirebaseTestLog';
import ImageUpload from './ImageUpload';
import Sidebar from '../Layout/Sidebar';
import Topbar from '../Layout/Topbar';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [logs, setLogs] = useState([]);
  const [isTestingFirebase, setIsTestingFirebase] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [companyName, setCompanyName] = useState('Minha Empresa');

  const handleLogout = async () => {
    await logout();
  };

  const handleTestFirebase = async () => {
    setIsTestingFirebase(true);
    setLogs([]);
    await testFirebaseOperations((log) => {
      setLogs((prevLogs) => [...prevLogs, log]);
    });
    setIsTestingFirebase(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Topbar companyName={companyName} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 pt-16">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard</h1>
            <p className="mb-6">Bem-vindo, {user?.email}!</p>
            <div className="space-y-4">
              <Button onClick={handleLogout}>Sair</Button>
              <Button onClick={handleTestFirebase} disabled={isTestingFirebase}>
                {isTestingFirebase ? 'Executando Testes...' : 'Executar Testes do Firebase'}
              </Button>
            </div>
            {logs.length > 0 && <FirebaseTestLog logs={logs} />}
            <ImageUpload />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;