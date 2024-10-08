import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, ProtectedRoute } from "./components/Auth/AuthProvider";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import Layout from "./components/Layout/Layout";
import UserProfile from "./components/Profile/UserProfile";
import DocumentationPage from "./components/Documentation/DocumentationPage";
import APIPage from "./components/APIs/APIPage";
import Vitrine from "./components/Vendedor/Vitrine";
import MeusProdutos from "./components/Vendedor/MeusProdutos";
import MeusPedidos from "./components/Vendedor/MeusPedidos";
import Estoque from "./components/Fornecedor/Estoque";
import PedidosFornecedor from "./components/Fornecedor/PedidosFornecedor";
import DetalheProduto from "./components/Produto/DetalheProduto";
import AdminUserList from "./components/Admin/AdminUserList";
import SettingsPage from "./components/Admin/SettingsPage";
import ChatAdmin from "./components/Admin/ChatAdmin";
import OpenAIIntegration from "./integrations/OpenAIIntegration";

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Navigate to="/dashboard" /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/vitrine" element={<ProtectedRoute><Layout><Vitrine /></Layout></ProtectedRoute>} />
        <Route path="/meus-produtos" element={<ProtectedRoute><Layout><MeusProdutos /></Layout></ProtectedRoute>} />
        <Route path="/meus-pedidos" element={<ProtectedRoute><Layout><MeusPedidos /></Layout></ProtectedRoute>} />
        <Route path="/estoque" element={<ProtectedRoute><Layout><Estoque /></Layout></ProtectedRoute>} />
        <Route path="/pedidos-fornecedor" element={<ProtectedRoute><Layout><PedidosFornecedor /></Layout></ProtectedRoute>} />
        <Route path="/integracoes" element={<ProtectedRoute><Layout><div>Integrações</div></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><UserProfile /></Layout></ProtectedRoute>} />
        <Route path="/documentation" element={<ProtectedRoute><Layout><DocumentationPage /></Layout></ProtectedRoute>} />
        <Route path="/apis" element={<ProtectedRoute><Layout><APIPage /></Layout></ProtectedRoute>} />
        <Route path="/suporte" element={<ProtectedRoute><Layout><div>Suporte</div></Layout></ProtectedRoute>} />
        <Route path="/produto/:id" element={<ProtectedRoute><Layout><DetalheProduto /></Layout></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><Layout><AdminUserList /></Layout></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><Layout><SettingsPage /></Layout></ProtectedRoute>} />
        <Route path="/admin/chat" element={<ProtectedRoute><Layout><ChatAdmin /></Layout></ProtectedRoute>} />
        <Route path="/admin/integrations/openai" element={<ProtectedRoute><Layout><OpenAIIntegration /></Layout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </AuthProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Router>
        <Toaster position="top-right" />
        <AppRoutes />
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
