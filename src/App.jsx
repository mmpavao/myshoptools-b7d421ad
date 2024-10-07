import React from "react";
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
import MeusProdutos from "./components/Produto/MeusProdutos";
import AdminUserList from "./components/Admin/AdminUserList";
import SettingsPage from "./components/Admin/SettingsPage";
import ChatAdmin from "./components/Admin/ChatAdmin";
import { getUserRole } from "./firebase/userOperations";
import OpenAIIntegration from "./integrations/OpenAIIntegration";
import GoogleSheetsIntegration from "./integrations/GoogleSheetsIntegration";

const queryClient = new QueryClient();

const RoleBasedRoute = ({ element: Element, allowedRoles }) => {
  const { user } = useAuth();
  const [userRole, setUserRole] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
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
  <AuthProvider>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute><Navigate to="/dashboard" /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><RoleBasedRoute element={Dashboard} allowedRoles={['Vendedor', 'Fornecedor', 'Admin', 'Master']} /></ProtectedRoute>} />
      <Route path="/vitrine" element={<ProtectedRoute><RoleBasedRoute element={Vitrine} allowedRoles={['Vendedor', 'Admin', 'Master']} /></ProtectedRoute>} />
      <Route path="/meus-pedidos" element={<ProtectedRoute><RoleBasedRoute element={MeusPedidos} allowedRoles={['Vendedor', 'Admin', 'Master']} /></ProtectedRoute>} />
      <Route path="/estoque" element={<ProtectedRoute><RoleBasedRoute element={Estoque} allowedRoles={['Fornecedor', 'Admin', 'Master']} /></ProtectedRoute>} />
      <Route path="/pedidos-fornecedor" element={<ProtectedRoute><RoleBasedRoute element={PedidosFornecedor} allowedRoles={['Fornecedor', 'Admin', 'Master']} /></ProtectedRoute>} />
      <Route path="/meus-produtos" element={<ProtectedRoute><RoleBasedRoute element={MeusProdutos} allowedRoles={['Vendedor', 'Fornecedor', 'Admin', 'Master']} /></ProtectedRoute>} />
      <Route path="/integracoes" element={<ProtectedRoute><RoleBasedRoute element={() => <div>Integrações</div>} allowedRoles={['Admin', 'Master']} /></ProtectedRoute>} />
      <Route path="/logs" element={<ProtectedRoute><RoleBasedRoute element={LogsPage} allowedRoles={['Admin', 'Master']} /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><RoleBasedRoute element={UserProfile} allowedRoles={['Vendedor', 'Fornecedor', 'Admin', 'Master']} /></ProtectedRoute>} />
      <Route path="/documentation" element={<ProtectedRoute><RoleBasedRoute element={DocumentationPage} allowedRoles={['Vendedor', 'Fornecedor', 'Admin', 'Master']} /></ProtectedRoute>} />
      <Route path="/apis" element={<ProtectedRoute><RoleBasedRoute element={APIPage} allowedRoles={['Admin', 'Master']} /></ProtectedRoute>} />
      <Route path="/suporte" element={<ProtectedRoute><RoleBasedRoute element={() => <div>Suporte</div>} allowedRoles={['Vendedor', 'Fornecedor', 'Admin', 'Master']} /></ProtectedRoute>} />
      <Route path="/produto/:id" element={<ProtectedRoute><RoleBasedRoute element={DetalheProduto} allowedRoles={['Vendedor', 'Fornecedor', 'Admin', 'Master']} /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute><RoleBasedRoute element={AdminUserList} allowedRoles={['Admin', 'Master']} /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute><RoleBasedRoute element={SettingsPage} allowedRoles={['Admin', 'Master']} /></ProtectedRoute>} />
      <Route path="/admin/chat" element={<ProtectedRoute><RoleBasedRoute element={ChatAdmin} allowedRoles={['Admin', 'Master']} /></ProtectedRoute>} />
      <Route path="/admin/integrations/openai" element={<ProtectedRoute><RoleBasedRoute element={OpenAIIntegration} allowedRoles={['Admin', 'Master']} /></ProtectedRoute>} />
      <Route path="/admin/integrations/google-sheets" element={<ProtectedRoute><RoleBasedRoute element={GoogleSheetsIntegration} allowedRoles={['Admin', 'Master']} /></ProtectedRoute>} />
      <Route path="*" element={<ProtectedRoute><Navigate to="/dashboard" /></ProtectedRoute>} />
    </Routes>
  </AuthProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
        <Router>
          <AuthProvider>
            <Toaster position="top-right" />
            <AppRoutes />
          </AuthProvider>
        </Router>
      </GoogleOAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;