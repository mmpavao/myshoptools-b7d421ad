import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, safeLogError } from '../../firebase/config';
import { onAuthStateChanged, signOut, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import { Spinner } from '../ui/spinner';
import { checkUserStatus } from '../../firebase/userOperations';
import { toast } from '@/components/ui/use-toast';
import firebaseOperations from '../../firebase/firebaseOperations';

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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const isActive = await checkUserStatus(currentUser.uid);
        if (!isActive) {
          await signOut(auth);
          toast({
            title: "Conta Inativa",
            description: "Sua conta foi desativada. Entre em contato com o administrador para reativar sua conta.",
            variant: "destructive",
          });
          navigate('/login');
        } else {
          const userProfile = await firebaseOperations.getUserProfile(currentUser.uid);
          setUser({ ...currentUser, ...userProfile });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const login = async (rememberMe) => {
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    } catch (error) {
      console.error("Erro ao configurar persistência:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("Desconectado com sucesso");
    } catch (error) {
      safeLogError(error);
      console.error("Erro ao Sair:", error);
    }
  };

  const updateUserContext = async (newUserData) => {
    if (user) {
      const updatedUser = { ...user, ...newUserData };
      setUser(updatedUser);
      await firebaseOperations.updateUserProfile(user.uid, newUserData);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUserContext,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <Spinner />;
  }

  return user ? children : null;
};