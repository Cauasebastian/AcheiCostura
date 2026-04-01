import React from 'react';
import { BrowserRouter } from 'react-router-dom'; 
import AppRoutes from './Routes/AppRoutes';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
// IMPORTANTE: Importe a nova transição
import ScreenTransition from './components/ScreenTransition'; 
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* A cortina fica aqui, cobrindo tudo quando ativada */}
        <ScreenTransition />
        
        <Header />
        <main className="main-content">
          <AppRoutes />
        </main>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;