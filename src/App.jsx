import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/Auth/AuthProvider';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import MeusProdutos from './components/Produto/MeusProdutos';
import Vitrine from './components/Vendedor/Vitrine';
import DetalheProduto from './components/Produto/DetalheProduto';
import { SpinnerDefault } from './components/ui/spinners';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <React.Suspense fallback={<div className="flex items-center justify-center h-screen"><SpinnerDefault /></div>}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/meus-produtos" element={<MeusProdutos />} />
              <Route path="/vitrine" element={<Vitrine />} />
              <Route path="/produto/:id" element={<DetalheProduto />} />
              {/* Adicione outras rotas conforme necessário */}
            </Routes>
          </React.Suspense>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;