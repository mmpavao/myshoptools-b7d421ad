import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, ProtectedRoute } from "./components/Auth/AuthProvider";
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

const queryClient = new QueryClient();

const PlaceholderComponent = ({ title }) => (
  <h1 className="text-2xl font-bold">{title}</h1>
);

const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
    <Route path="/vitrine" element={<ProtectedLayout><Vitrine /></ProtectedLayout>} />
    <Route path="/meus-pedidos" element={<ProtectedLayout><MeusPedidos /></ProtectedLayout>} />
    <Route path="/estoque" element={<ProtectedLayout><Estoque /></ProtectedLayout>} />
    <Route path="/pedidos-fornecedor" element={<ProtectedLayout><PedidosFornecedor /></ProtectedLayout>} />
    <Route path="/lista-produtos" element={<ProtectedLayout><ListaProdutos /></ProtectedLayout>} />
    <Route path="/integracoes" element={<ProtectedLayout><PlaceholderComponent title="Integrações" /></ProtectedLayout>} />
    <Route path="/logs" element={<ProtectedLayout><LogsPage /></ProtectedLayout>} />
    <Route path="/profile" element={<ProtectedLayout><UserProfile /></ProtectedLayout>} />
    <Route path="/documentation" element={<ProtectedLayout><DocumentationPage /></ProtectedLayout>} />
    <Route path="/apis" element={<ProtectedLayout><APIPage /></ProtectedLayout>} />
    <Route path="/suporte" element={<ProtectedLayout><PlaceholderComponent title="Suporte" /></ProtectedLayout>} />
    <Route path="/produto/:id" element={<ProtectedLayout><DetalheProduto /></ProtectedLayout>} />
    <Route path="/" element={<Navigate to="/dashboard" />} />
    <Route path="*" element={<Navigate to="/dashboard" />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Router>
        <AuthProvider>
          <Toaster position="top-right" />
          <AppRoutes />
        </AuthProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

