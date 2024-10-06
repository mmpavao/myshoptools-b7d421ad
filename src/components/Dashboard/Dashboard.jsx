import React from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { Button } from '../ui/button';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Informações do Usuário</h2>
        <p className="mb-2"><strong>Email:</strong> {user?.email}</p>
        <p className="mb-4"><strong>ID:</strong> {user?.uid}</p>
        <Button onClick={handleLogout}>Sair</Button>
      </div>
    </div>
  );
};

export default Dashboard;