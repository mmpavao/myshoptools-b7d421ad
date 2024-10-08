import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import Layout from './components/Layout/Layout';
import { AuthProvider } from './components/Auth/AuthProvider';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <ThemeProvider attribute="class">
      <Router>
        <AuthProvider>
          <Layout>
            <AppRoutes />
          </Layout>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;