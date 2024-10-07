import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, safeLogError } from '../../firebase/config';
import { onAuthStateChanged, signOut, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '../ui/spinner';
import { checkUserStatus } from '../../firebase/userOperations';
import { toast } from '@/components/ui/use-toast';
import firebaseOperations from '../../firebase/firebaseOperations';

const AuthContext = createContext();
const MASTER_USER_EMAIL = 'pavaosmart@gmail.com';

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
    console.log('AuthProvider: Iniciando monitoramento de estado de autenticação');
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('AuthProvider: Estado de autenticação mudou', currentUser ? 'Usuário autenticado' : 'Usuário não autenticado');
      if (currentUser) {
        try {
          console.log('AuthProvider: Buscando perfil do usuário');
          const userProfile = await firebaseOperations.getUserProfile(currentUser.uid);
          console.log('AuthProvider: Perfil do usuário obtido', userProfile);
          
          if (currentUser.email === MASTER_USER_EMAIL) {
            console.log('AuthProvider: Usuário Master identificado');
            setUser({ ...currentUser, ...userProfile, role: 'Master', status: 'Active' });
          } else {
            console.log('AuthProvider: Verificando status do usuário');
            const isActive = await checkUserStatus(currentUser.uid);
            console.log('AuthProvider: Status do usuário', isActive ? 'Ativo' : 'Inativo');
            if (isActive) {
              setUser({ ...currentUser, ...userProfile });
            } else {
              console.log('AuthProvider: Usuário inativo, fazendo logout');
              await logout();
              toast({
                title: "Conta Inativa",
                description: "Sua conta foi desativada. Entre em contato com o administrador para reativar sua conta.",
                variant: "destructive",
              });
            }
          }
        } catch (error) {
          console.error("AuthProvider: Erro ao verificar o status do usuário:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      console.log('AuthProvider: Cancelando monitoramento de estado de autenticação');
      unsubscribe();
    };
  }, [navigate]);

  const login = async (rememberMe) => {
    console.log('AuthProvider: Iniciando login', rememberMe ? 'com persistência' : 'sem persistência');
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      console.log('AuthProvider: Persistência configurada com sucesso');
    } catch (error) {
      console.error("AuthProvider: Erro ao configurar persistência:", error);
    }
  };

  const logout = async () => {
    console.log('AuthProvider: Iniciando logout');
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      console.log("AuthProvider: Desconectado com sucesso");
      navigate('/login');
    } catch (error) {
      safeLogError(error);
      console.error("AuthProvider: Erro ao Sair:", error);
    }
  };

  const updateUserContext = async (newUserData) => {
    console.log('AuthProvider: Atualizando contexto do usuário', newUserData);
    if (user) {
      const updatedUser = { ...user, ...newUserData };
      setUser(updatedUser);
      await firebaseOperations.updateUserProfile(user.uid, newUserData);
      console.log('AuthProvider: Contexto do usuário atualizado com sucesso');
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
      console.log('ProtectedRoute: Usuário não autenticado, redirecionando para login');
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <Spinner />;
  }

  return user ? children : null;
};