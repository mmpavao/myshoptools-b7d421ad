import React, { useState } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { Button } from '../ui/button';
import { testFirebaseOperations } from '../../firebase/firebaseOperations';
import FirebaseTestLog from './FirebaseTestLog';
import ImageUpload from './ImageUpload';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [logs, setLogs] = useState([]);
  const [isTestingFirebase, setIsTestingFirebase] = useState(false);

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

  return (
    <>
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
    </>
  );
};

export default Dashboard;