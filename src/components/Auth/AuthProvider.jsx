import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Navigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { safeLogError } from '../../firebase/config';
import { Spinner } from '../ui/spinner';

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        toast({
          title: "Login bem-sucedido",
          description: `Bem-vindo, ${user.displayName || user.email}!`,
          variant: "success",
        });
      }
    }, (error) => {
      safeLogError(error);
      setLoading(false);
      toast({
        title: "Erro de Autenticação",
        description: "Houve um problema com o serviço de autenticação. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Desconectado",
        description: "Você foi desconectado com sucesso.",
        variant: "success",
      });
    } catch (error) {
      safeLogError(error);
      toast({
        title: "Erro ao Sair",
        description: "Houve um problema ao sair. Por favor, tente novamente.",
        variant: "destructive",
      });
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
