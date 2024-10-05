const ProtectedRoute = ({ children }) => {
  const { user, loading, error } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Pode trocar por um spinner ou animação de carregamento
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Exibe o erro, se houver
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};
