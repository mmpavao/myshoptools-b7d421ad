import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import Layout from './components/Layout/Layout';
import { AuthProvider } from './components/Auth/AuthProvider';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <ThemeProvider attribute="class">
      <AuthProvider>
        <Router>
          <Layout>
            <AppRoutes />
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
