import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { ServiceDetail } from './pages/ServiceDetail';
import { Login } from './pages/Login';
import { CadastroPage } from './pages/CadastroPage';
import { CompanyDashboard } from './pages/CompanyDashboard';
import { CompanyJobCandidates } from './pages/CompanyJobCandidates';
import { MinhasCandidaturas } from './pages/MinhasCandidaturas';
import { BuscaCostureiros } from './pages/BuscaCostureiros';
import { CostureiroProfile } from './pages/CostureiroProfile';
import { Profile } from './pages/Profile';

import ContatoPage from './pages/contato';
import SobreNosPage from './pages/sobre';
import PlanosPage from './pages/planos';

SobreNosPage

import HomeServicos from './components/HomeServicos';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            {/* Home padrão (versão cards) */}
            <Route path="/" element={<Home />} />
            
            {/* Home alternativa (versão integrada com sistema de moedas) */}
            <Route path="/oportunidades" element={<HomeServicos />} />
            
            {/* Detalhes do serviço */}
            <Route path="/service/:id" element={<ServiceDetail />} />
            
            {/* Autenticação */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<CadastroPage />} />

            {/* Minhas Candidaturas */}
            <Route path="/my-applications" element={<MinhasCandidaturas />} />

            {/* Área da Empresa */}
            <Route path="/empresa/dashboard" element={<CompanyDashboard />} />
            <Route path="/empresa/vaga/:id/candidatos" element={<CompanyJobCandidates />} />
            <Route path="/empresa/buscar" element={<BuscaCostureiros />} />
            <Route path="/costureiro/:id" element={<CostureiroProfile />} />
            
            <Route path="/contato" element={<ContatoPage />} />
            <Route path="/sobre-nos" element={<SobreNosPage />} />
            <Route path="/planos" element={<PlanosPage />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/profile" element={<Profile />} />
            {/* Páginas institucionais 
            
            
            
            <Route path="/anuncie" element={<AnunciePage />} />
            <Route path="/pagamento" element={<PagamentoPage />} />
            */}

            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </Router>
  );
}
