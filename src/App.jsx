import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, ProtectedRoute, useAuth } from "./components/Auth/AuthProvider";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Layout from "./components/Layout/Layout";
import { getUserRole } from "./firebase/userOperations";
import Dashboard from "./components/Dashboard/Dashboard";
import Vitrine from "./components/Vendedor/Vitrine";
import MeusPedidos from "./components/Vendedor/MeusPedidos";
import MeusProdutos from "./components/Produto/MeusProdutos";
import Estoque from "./components/Fornecedor/Estoque";
import PedidosFornecedor from "./components/Fornecedor/PedidosFornecedor";
import AdminUserList from "./components/Admin/AdminUserList";
import ChatAdmin from "./components/Admin/ChatAdmin";
import SettingsPage from "./components/Admin/SettingsPage";
import Suporte from "./components/Suporte/Suporte";
import UserProfile from "./components/Profile/UserProfile";
import LogsPage from "./components/Logs/LogsPage";
import DocumentationPage from "./components/Documentation/DocumentationPage";
import APIPage from "./components/APIs/APIPage";
import DetalheProduto from "./components/Produto/DetalheProduto";

const queryClient = new QueryClient();

const RoleBasedRoute = ({ element: Element, allowedRoles }) => {
  const [userRole, setUserRole] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const { user } = useAuth();

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
    return <div>Carregando...</div>;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" />;
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
    <Route path="/" element={<ProtectedRoute><Navigate to="/dashboard" /></ProtectedRoute>} />
    <Route path="/dashboard" element={
      <ProtectedRoute>
        <RoleBasedRoute element={Dashboard} allowedRoles={['Vendedor', 'Fornecedor', 'Admin', 'Master']} />
      </ProtectedRoute>
    } />
    <Route path="/vitrine" element={
      <ProtectedRoute>
        <RoleBasedRoute element={Vitrine} allowedRoles={['Vendedor', 'Admin', 'Master']} />
      </ProtectedRoute>
    } />
    <Route path="/meus-pedidos" element={
      <ProtectedRoute>
        <RoleBasedRoute element={MeusPedidos} allowedRoles={['Vendedor', 'Admin', 'Master']} />
      </ProtectedRoute>
    } />
    <Route path="/meus-produtos" element={
      <ProtectedRoute>
        <RoleBasedRoute element={MeusProdutos} allowedRoles={['Vendedor', 'Admin', 'Master']} />
      </ProtectedRoute>
    } />
    <Route path="/estoque" element={
      <ProtectedRoute>
        <RoleBasedRoute element={Estoque} allowedRoles={['Fornecedor', 'Admin', 'Master']} />
      </ProtectedRoute>
    } />
    <Route path="/pedidos-fornecedor" element={
      <ProtectedRoute>
        <RoleBasedRoute element={PedidosFornecedor} allowedRoles={['Fornecedor', 'Admin', 'Master']} />
      </ProtectedRoute>
    } />
    <Route path="/admin/users" element={
      <ProtectedRoute>
        <RoleBasedRoute element={AdminUserList} allowedRoles={['Admin', 'Master']} />
      </ProtectedRoute>
    } />
    <Route path="/admin/chat" element={
      <ProtectedRoute>
        <RoleBasedRoute element={ChatAdmin} allowedRoles={['Admin', 'Master']} />
      </ProtectedRoute>
    } />
    <Route path="/admin/settings" element={
      <ProtectedRoute>
        <RoleBasedRoute element={SettingsPage} allowedRoles={['Admin', 'Master']} />
      </ProtectedRoute>
    } />
    <Route path="/suporte" element={
      <ProtectedRoute>
        <RoleBasedRoute element={Suporte} allowedRoles={['Vendedor', 'Fornecedor', 'Admin', 'Master']} />
      </ProtectedRoute>
    } />
    <Route path="/profile" element={
      <ProtectedRoute>
        <RoleBasedRoute element={UserProfile} allowedRoles={['Vendedor', 'Fornecedor', 'Admin', 'Master']} />
      </ProtectedRoute>
    } />
    <Route path="/logs" element={
      <ProtectedRoute>
        <RoleBasedRoute element={LogsPage} allowedRoles={['Admin', 'Master']} />
      </ProtectedRoute>
    } />
    <Route path="/documentation" element={
      <ProtectedRoute>
        <RoleBasedRoute element={DocumentationPage} allowedRoles={['Vendedor', 'Fornecedor', 'Admin', 'Master']} />
      </ProtectedRoute>
    } />
    <Route path="/apis" element={
      <ProtectedRoute>
        <RoleBasedRoute element={APIPage} allowedRoles={['Admin', 'Master']} />
      </ProtectedRoute>
    } />
    <Route path="/produto/:id" element={
      <ProtectedRoute>
        <RoleBasedRoute element={DetalheProduto} allowedRoles={['Vendedor', 'Fornecedor', 'Admin', 'Master']} />
      </ProtectedRoute>
    } />
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
          </AuthProvider>
        </Router>
      </GoogleOAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
