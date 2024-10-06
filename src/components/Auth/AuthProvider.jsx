import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, safeLogError } from '../../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import { Spinner } from '../ui/spinner';
import { checkUserStatus } from '../../firebase/userOperations';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AuthProvider: Iniciando listener de autenticação');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('AuthProvider: Estado de autenticação mudou', user ? 'Usuário logado' : 'Usuário deslogado');
      if (user) {
        console.log('AuthProvider: Verificando status do usuário', user.uid);
        const isActive = await checkUserStatus(user.uid);
        if (!isActive) {
          console.log('AuthProvider: Usuário inativo, fazendo logout');
          await signOut(auth);
          toast({
            title: "Conta Inativa",
            description: "Sua conta foi desativada. Entre em contato com o administrador para reativar sua conta.",
            variant: "destructive",
          });
          navigate('/login');
        } else {
          console.log('AuthProvider: Usuário ativo, atualizando estado');
          setUser(user);
        }
      } else {
        console.log('AuthProvider: Nenhum usuário, limpando estado');
        setUser(null);
      }
      setLoading(false);
    }, (error) => {
      safeLogError(error);
      setLoading(false);
      console.error("Erro de Autenticação:", error);
    });

    return () => {
      console.log('AuthProvider: Removendo listener de autenticação');
      unsubscribe();
    };
  }, [navigate]);

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("Desconectado com sucesso");
    } catch (error) {
      safeLogError(error);
      console.error("Erro ao Sair:", error);
    }
  };

  const updateUserContext = (newUserData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...newUserData,
    }));
  };

  const value = {
    user,
    loading,
    logout,
    updateUserContext,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};