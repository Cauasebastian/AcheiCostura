import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import logoAcheiCostura from '../../assets/logo.png'; 

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        
        <div className="footer-logo">
          <img src={logoAcheiCostura} alt="Achei Costura" />
        </div>

        <nav className="footer-links">
          <Link to="../home">Achei costura</Link>
          <Link to="/login">Login</Link>
          <Link to="/cadastro">cadastro</Link>
          <Link to="/anuncie">Seu anúncio</Link>
        </nav>

        <div className="footer-direitos">
          <p>Todos os direitos reservados © Achei Costura</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;