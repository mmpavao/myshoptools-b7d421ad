import React from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { Button } from '../ui/button';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  if (!auth) {
    return <div>Carregando...</div>;
  }

  const { user, logout } = auth;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bem-vindo ao Painel do MyShopTools</h1>
      <p className="mb-4">Logado como: {user?.email}</p>
      <div className="space-x-4">
        <Link to="/profile">
          <Button variant="outline">Atualizar Perfil</Button>
        </Link>
        <Button onClick={handleLogout}>Sair</Button>
      </div>
    </div>
  );
};

export default Dashboard;