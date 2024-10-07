import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, ProtectedRoute, useAuth } from "./components/Auth/AuthProvider";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import Layout from "./components/Layout/Layout";
import UserProfile from "./components/Profile/UserProfile";
import Vitrine from "./components/Vendedor/Vitrine";
import MeusPedidos from "./components/Vendedor/MeusPedidos";
import Estoque from "./components/Fornecedor/Estoque";
import PedidosFornecedor from "./components/Fornecedor/PedidosFornecedor";
import MeusProdutos from "./components/Produto/MeusProdutos";
import AdminUserList from "./components/Admin/AdminUserList";
import SettingsPage from "./components/Admin/SettingsPage";
import ChatAdmin from "./components/Admin/ChatAdmin";
import ChatWidget from "./components/Chat/ChatWidget";
import { getUserRole, userRoles } from "./firebase/userOperations";
import { updateMasterUser } from "./firebase/updateMasterUser";

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
      <Route path="/dashboard" element={<ProtectedRoute><RoleBasedRoute element={Dashboard} allowedRoles={[userRoles.VENDOR, userRoles.PROVIDER, userRoles.ADMIN, userRoles.MASTER]} /></ProtectedRoute>} />
      <Route path="/vitrine" element={<ProtectedRoute><RoleBasedRoute element={Vitrine} allowedRoles={[userRoles.VENDOR, userRoles.ADMIN, userRoles.MASTER]} /></ProtectedRoute>} />
      <Route path="/meus-pedidos" element={<ProtectedRoute><RoleBasedRoute element={MeusPedidos} allowedRoles={[userRoles.VENDOR, userRoles.ADMIN, userRoles.MASTER]} /></ProtectedRoute>} />
      <Route path="/estoque" element={<ProtectedRoute><RoleBasedRoute element={Estoque} allowedRoles={[userRoles.PROVIDER, userRoles.ADMIN, userRoles.MASTER]} /></ProtectedRoute>} />
      <Route path="/pedidos-fornecedor" element={<ProtectedRoute><RoleBasedRoute element={PedidosFornecedor} allowedRoles={[userRoles.PROVIDER, userRoles.ADMIN, userRoles.MASTER]} /></ProtectedRoute>} />
      <Route path="/meus-produtos" element={<ProtectedRoute><RoleBasedRoute element={MeusProdutos} allowedRoles={[userRoles.VENDOR, userRoles.PROVIDER, userRoles.ADMIN, userRoles.MASTER]} /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><RoleBasedRoute element={UserProfile} allowedRoles={[userRoles.VENDOR, userRoles.PROVIDER, userRoles.ADMIN, userRoles.MASTER]} /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute><RoleBasedRoute element={AdminUserList} allowedRoles={[userRoles.ADMIN, userRoles.MASTER]} /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute><RoleBasedRoute element={SettingsPage} allowedRoles={[userRoles.ADMIN, userRoles.MASTER]} /></ProtectedRoute>} />
      <Route path="/admin/chat" element={<ProtectedRoute><RoleBasedRoute element={ChatAdmin} allowedRoles={[userRoles.ADMIN, userRoles.MASTER]} /></ProtectedRoute>} />
      <Route path="*" element={<ProtectedRoute><Navigate to="/dashboard" /></ProtectedRoute>} />
    </Routes>
  </AuthProvider>
);

const App = () => {
  useEffect(() => {
    updateMasterUser();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
          <Router>
            <Toaster position="top-right" />
            <AppRoutes />
            <ChatWidget />
          </Router>
        </GoogleOAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;