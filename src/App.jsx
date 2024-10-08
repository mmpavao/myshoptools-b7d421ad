import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, ProtectedRoute } from "./components/Auth/AuthProvider";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Layout from "./components/Layout/Layout";
import { getUserRole } from "./firebase/userOperations";

// Import other components as needed

const queryClient = new QueryClient();

const RoleBasedRoute = ({ element: Element, allowedRoles }) => {
  return (
    <ProtectedRoute>
      {(user) => {
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

        if (!allowedRoles.includes(userRole)) {
          return <Navigate to="/dashboard" />;
        }

        return (
          <Layout>
            <Element />
          </Layout>
        );
      }}
    </ProtectedRoute>
  );
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/" element={<ProtectedRoute><Navigate to="/dashboard" /></ProtectedRoute>} />
    <Route path="/dashboard" element={<RoleBasedRoute element={Dashboard} allowedRoles={['Vendedor', 'Fornecedor', 'Admin', 'Master']} />} />
    {/* Add other routes here */}
    <Route path="*" element={<ProtectedRoute><Navigate to="/dashboard" /></ProtectedRoute>} />
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