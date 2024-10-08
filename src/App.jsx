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
import { auth } from "./firebase/config";

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
    return <div>Loading...</div>;
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
    {/* Add other routes here */}
    <Route path="/vitrine" element={
      <ProtectedRoute>
        <RoleBasedRoute element={() => <div>Vitrine</div>} allowedRoles={['Vendedor', 'Admin', 'Master']} />
      </ProtectedRoute>
    } />
    <Route path="/meus-pedidos" element={
      <ProtectedRoute>
        <RoleBasedRoute element={() => <div>Meus Pedidos</div>} allowedRoles={['Vendedor', 'Admin', 'Master']} />
      </ProtectedRoute>
    } />
    <Route path="/meus-produtos" element={
      <ProtectedRoute>
        <RoleBasedRoute element={() => <div>Meus Produtos</div>} allowedRoles={['Vendedor', 'Admin', 'Master']} />
      </ProtectedRoute>
    } />
    <Route path="/estoque" element={
      <ProtectedRoute>
        <RoleBasedRoute element={() => <div>Estoque</div>} allowedRoles={['Fornecedor', 'Admin', 'Master']} />
      </ProtectedRoute>
    } />
    <Route path="/pedidos-fornecedor" element={
      <ProtectedRoute>
        <RoleBasedRoute element={() => <div>Pedidos Fornecedor</div>} allowedRoles={['Fornecedor', 'Admin', 'Master']} />
      </ProtectedRoute>
    } />
    <Route path="/admin/users" element={
      <ProtectedRoute>
        <RoleBasedRoute element={() => <div>Usuários</div>} allowedRoles={['Admin', 'Master']} />
      </ProtectedRoute>
    } />
    <Route path="/admin/chat" element={
      <ProtectedRoute>
        <RoleBasedRoute element={() => <div>Chat Admin</div>} allowedRoles={['Admin', 'Master']} />
      </ProtectedRoute>
    } />
    <Route path="/admin/settings" element={
      <ProtectedRoute>
        <RoleBasedRoute element={() => <div>Configurações</div>} allowedRoles={['Admin', 'Master']} />
      </ProtectedRoute>
    } />
    <Route path="/suporte" element={
      <ProtectedRoute>
        <RoleBasedRoute element={() => <div>Suporte</div>} allowedRoles={['Vendedor', 'Fornecedor', 'Admin', 'Master']} />
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