import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import { safeLogError } from '../../firebase/config';
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isActive = await checkUserStatus(user.uid);
        if (!isActive) {
          await signOut(auth);
          toast({
            title: "Conta Inativa",
            description: "Sua conta foi desativada. Entre em contato com o administrador para reativar sua conta.",
            variant: "destructive",
          });
          navigate('/login');
        } else {
          setUser(user);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    }, (error) => {
      safeLogError(error);
      setLoading(false);
      console.error("Erro de Autenticação:", error);
    });

    return () => unsubscribe();
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
