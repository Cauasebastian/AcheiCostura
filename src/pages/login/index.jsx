import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SpeechButton from '../../components/SpeechButton';
import { useAuth } from '../../context/AuthContext';
import './style.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, finishTransition } = useAuth();
  const navigate = useNavigate();

  const textoTitulo = "Login";
  const textoEmail = "Email";
  const textoSenha = "Senha";

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        
        <div className="form-header">
          <h1>{textoTitulo}</h1>
          <SpeechButton textToSpeak={textoTitulo} />
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="form-label-container">
              <label htmlFor="email">{textoEmail}</label>
              <SpeechButton textToSpeak={textoEmail} />
            </div>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="input-group">
            <div className="form-label-container">
              <label htmlFor="senha">{textoSenha}</label>
              <SpeechButton textToSpeak={textoSenha} />
            </div>
            <input 
              type="password" 
              id="senha" 
              name="senha" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/esqueci-senha">Esqueceu a sua senha?</Link>
          <Link to="/cadastro">Não possui um cadastro?</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;