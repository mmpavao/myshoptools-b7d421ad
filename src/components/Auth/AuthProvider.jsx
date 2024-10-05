import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const ProtectedRoute = ({ children }) => {
  const { user, loading, error } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Aqui você pode substituir por um spinner ou outro indicador de carregamento
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Exibe o erro capturado, se houver
  }

  if (!user) {
    return <Navigate to="/login" replace />; // Redireciona para login se o usuário não estiver autenticado
  }

  return children; // Retorna os filhos se o usuário estiver autenticado
};

export default ProtectedRoute;
