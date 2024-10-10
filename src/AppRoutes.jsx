import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './components/Auth/AuthProvider';
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
import VissaGlobalTradePage from "./components/VissaGlobalTrade/HomePage";
import VissaSiteAdmin from "./components/Admin/VissaSiteAdmin";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/wallet" element={
          <ProtectedRoute>
            <Layout>
              <Wallet />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/vitrine" element={
          <ProtectedRoute>
            <Layout>
              <Vitrine />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/meus-produtos" element={
          <ProtectedRoute>
            <Layout>
              <MeusProdutos />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/meus-pedidos" element={
          <ProtectedRoute>
            <Layout>
              <MeusPedidos />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/estoque" element={
          <ProtectedRoute>
            <Layout>
              <Estoque />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/pedidos-fornecedor" element={
          <ProtectedRoute>
            <Layout>
              <PedidosFornecedor />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/integracoes" element={
          <ProtectedRoute>
            <Layout>
              <div>Integrações</div>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout>
              <UserProfile />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/documentation" element={
          <ProtectedRoute>
            <Layout>
              <DocumentationPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/apis" element={
          <ProtectedRoute>
            <Layout>
              <APIPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/suporte" element={
          <ProtectedRoute>
            <Layout>
              <div>Suporte</div>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/produto/:id" element={
          <ProtectedRoute>
            <Layout>
              <DetalheProduto />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute>
            <Layout>
              <AdminUserList />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute>
            <Layout>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/chat" element={
          <ProtectedRoute>
            <Layout>
              <ChatAdmin />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/integrations/openai" element={
          <ProtectedRoute>
            <Layout>
              <OpenAIIntegration />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/vissa-site" element={
          <ProtectedRoute>
            <Layout>
              <VissaSiteAdmin />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/landpage" element={<VissaGlobalTradePage />} />
        <Route path="/LandingPage" element={<VissaGlobalTradePage />} />
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;