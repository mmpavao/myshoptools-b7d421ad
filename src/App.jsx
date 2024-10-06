import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, ProtectedRoute } from "./components/Auth/AuthProvider";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard/Dashboard";

const queryClient = new QueryClient();

const Layout = ({ children }) => (
  <div className="min-h-screen bg-background">
    <main className="container mx-auto py-6">{children}</main>
  </div>
);

const PlaceholderComponent = ({ title }) => (
  <div className="flex items-center justify-center h-screen">
    <h1 className="text-2xl font-bold">{title}</h1>
  </div>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Layout><Login /></Layout>} />
    <Route path="/register" element={<Layout><Register /></Layout>} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/vitrine"
      element={
        <ProtectedRoute>
          <PlaceholderComponent title="Vitrine" />
        </ProtectedRoute>
      }
    />
    <Route
      path="/produtos"
      element={
        <ProtectedRoute>
          <PlaceholderComponent title="Meus Produtos" />
        </ProtectedRoute>
      }
    />
    <Route
      path="/pedidos"
      element={
        <ProtectedRoute>
          <PlaceholderComponent title="Pedidos" />
        </ProtectedRoute>
      }
    />
    <Route
      path="/suporte"
      element={
        <ProtectedRoute>
          <PlaceholderComponent title="Suporte" />
        </ProtectedRoute>
      }
    />
    <Route
      path="/integracoes"
      element={
        <ProtectedRoute>
          <PlaceholderComponent title="Integrações" />
        </ProtectedRoute>
      }
    />
    <Route
      path="/logs"
      element={
        <ProtectedRoute>
          <PlaceholderComponent title="Logs" />
        </ProtectedRoute>
      }
    />
    <Route path="/" element={<Navigate to="/dashboard" />} />
    <Route path="*" element={<Navigate to="/dashboard" />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Router>
        <AuthProvider>
          <Toaster />
          <AppRoutes />
        </AuthProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;