import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/Auth/AuthProvider';
import Layout from './components/Layout/Layout';
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard/Dashboard";
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
import LandingPage from "./pages/LandingPage";
import Wallet from "./components/Wallet/Wallet";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/vitrine" element={<Vitrine />} />
        <Route path="/meus-produtos" element={<MeusProdutos />} />
        <Route path="/meus-pedidos" element={<MeusPedidos />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/pedidos-fornecedor" element={<PedidosFornecedor />} />
        <Route path="/integracoes" element={<div>Integrações</div>} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/documentation" element={<DocumentationPage />} />
        <Route path="/apis" element={<APIPage />} />
        <Route path="/suporte" element={<div>Suporte</div>} />
        <Route path="/produto/:id" element={<DetalheProduto />} />
        <Route path="/admin/users" element={<AdminUserList />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
        <Route path="/admin/chat" element={<ChatAdmin />} />
        <Route path="/admin/integrations/openai" element={<OpenAIIntegration />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;