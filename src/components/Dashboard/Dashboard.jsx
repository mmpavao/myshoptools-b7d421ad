import React from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { testFirebaseOperations } from '../../firebase/firebaseOperations';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleTestFirebase = async () => {
    await testFirebaseOperations();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bem-vindo ao Painel do MyShopTools</h1>
      <p className="mb-4">Logado como: {user?.email}</p>
      <div className="space-x-4">
        <Button onClick={handleLogout}>Sair</Button>
        <Button onClick={handleTestFirebase}>Testar Operações Firebase</Button>
      </div>
    </div>
  );
};

export default Dashboard;