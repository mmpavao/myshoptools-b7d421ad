import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, ProtectedRoute, useAuth } from "./components/Auth/AuthProvider";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import LogsPage from "./components/Logs/LogsPage";
import Layout from "./components/Layout/Layout";
import UserProfile from "./components/Profile/UserProfile";
import DocumentationPage from "./components/Documentation/DocumentationPage";
import APIPage from "./components/APIs/APIPage";
import Vitrine from "./components/Vendedor/Vitrine";
import MeusPedidos from "./components/Vendedor/MeusPedidos";
import Estoque from "./components/Fornecedor/Estoque";
import PedidosFornecedor from "./components/Fornecedor/PedidosFornecedor";
import DetalheProduto from "./components/Produto/DetalheProduto";
import ListaProdutos from "./components/Produto/ListaProdutos";
import AdminUserList from "./components/Admin/AdminUserList";
import SettingsPage from "./components/Admin/SettingsPage";
import ChatAdmin from "./components/Admin/ChatAdmin";
import ChatWidget from "./components/Chat/ChatWidget";
import { getUserRole } from "./firebase/userOperations";
import OpenAIIntegration from "./integrations/OpenAIIntegration";
import GoogleSheetsIntegration from "./integrations/GoogleSheetsIntegration";

const queryClient = new QueryClient();

const RoleBasedRoute = ({ element: Element, allowedRoles }) => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const role = await getUserRole(user.uid);
        setUserRole(role);
      }
      setLoading(false);
    };
    fetchUserRole();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <Element />
    </Layout>
  );
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/dashboard" element={<RoleBasedRoute element={Dashboard} allowedRoles={['Vendedor', 'Fornecedor', 'Admin', 'Master']} />} />
    <Route path="/vitrine" element={<RoleBasedRoute element={Vitrine} allowedRoles={['Vendedor', 'Admin', 'Master']} />} />
    <Route path="/meus-pedidos" element={<RoleBasedRoute element={MeusPedidos} allowedRoles={['Vendedor', 'Admin', 'Master']} />} />
    <Route path="/estoque" element={<RoleBasedRoute element={Estoque} allowedRoles={['Fornecedor', 'Admin', 'Master']} />} />
    <Route path="/pedidos-fornecedor" element={<RoleBasedRoute element={PedidosFornecedor} allowedRoles={['Fornecedor', 'Admin', 'Master']} />} />
    <Route path="/lista-produtos" element={<RoleBasedRoute element={ListaProdutos} allowedRoles={['Vendedor', 'Fornecedor', 'Admin', 'Master']} />} />
    <Route path="/integracoes" element={<RoleBasedRoute element={() => <div>Integrações</div>} allowedRoles={['Admin', 'Master']} />} />
    <Route path="/logs" element={<RoleBasedRoute element={LogsPage} allowedRoles={['Admin', 'Master']} />} />
    <Route path="/profile" element={<RoleBasedRoute element={UserProfile} allowedRoles={['Vendedor', 'Fornecedor', 'Admin', 'Master']} />} />
    <Route path="/documentation" element={<RoleBasedRoute element={DocumentationPage} allowedRoles={['Vendedor', 'Fornecedor', 'Admin', 'Master']} />} />
    <Route path="/apis" element={<RoleBasedRoute element={APIPage} allowedRoles={['Admin', 'Master']} />} />
    <Route path="/suporte" element={<RoleBasedRoute element={() => <div>Suporte</div>} allowedRoles={['Vendedor', 'Fornecedor', 'Admin', 'Master']} />} />
    <Route path="/produto/:id" element={<RoleBasedRoute element={DetalheProduto} allowedRoles={['Vendedor', 'Fornecedor', 'Admin', 'Master']} />} />
    <Route path="/admin/users" element={<RoleBasedRoute element={AdminUserList} allowedRoles={['Admin', 'Master']} />} />
    <Route path="/admin/settings" element={<RoleBasedRoute element={SettingsPage} allowedRoles={['Admin', 'Master']} />} />
    <Route path="/admin/chat" element={<RoleBasedRoute element={ChatAdmin} allowedRoles={['Admin', 'Master']} />} />
    <Route path="/admin/integrations/openai" element={<RoleBasedRoute element={OpenAIIntegration} allowedRoles={['Admin', 'Master']} />} />
    <Route path="/admin/integrations/google-sheets" element={<RoleBasedRoute element={GoogleSheetsIntegration} allowedRoles={['Admin', 'Master']} />} />
    <Route path="/" element={<Navigate to="/dashboard" />} />
    <Route path="*" element={<Navigate to="/dashboard" />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
        <Router>
          <AuthProvider>
            <Toaster position="top-right" />
            <AppRoutes />
            <ChatWidget />
          </AuthProvider>
        </Router>
      </GoogleOAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;