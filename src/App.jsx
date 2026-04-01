import React from 'react';
import { BrowserRouter } from 'react-router-dom'; 
import AppRoutes from './Routes/AppRoutes';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <BrowserRouter>
    <AuthProvider> {/* AuthProvider DEVE envolver tudo que usa useAuth */}
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