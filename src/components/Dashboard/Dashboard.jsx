import React, { useState } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { testFirebaseOperations } from '../../firebase/firebaseOperations';
import FirebaseTestLog from './FirebaseTestLog';
import ImageUpload from './ImageUpload';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [isTestingFirebase, setIsTestingFirebase] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bem-vindo ao Painel do MyShopTools</h1>
      <p className="mb-4">Logado como: {user?.email}</p>
      <div className="space-y-4">
        <Button onClick={handleLogout}>Sair</Button>
        <Button onClick={handleTestFirebase} disabled={isTestingFirebase}>
          {isTestingFirebase ? 'Executando Testes...' : 'Executar Testes do Firebase'}
        </Button>
      </div>
      {logs.length > 0 && <FirebaseTestLog logs={logs} />}
      <div className="mt-8">
        <ImageUpload />
      </div>
    </div>
  );
};

export default Dashboard;