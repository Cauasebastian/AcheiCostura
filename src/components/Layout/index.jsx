import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import './style.css'; 

function Layout({ children }) {
  return (
    <div className="app-container"> 
      <Header />
      <main className="main-content-wrapper"> 
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;