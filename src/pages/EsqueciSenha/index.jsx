import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SpeechButton from '../../components/SpeechButton';
import './style.css'; 

function EsqueciSenhaPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: Código, 3: Nova Senha
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  
  const navigate = useNavigate();

  // Etapa 1: Enviar o email
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar o email de recuperação para a API
    console.log(`Enviando código para o email: ${email}`);
    alert('Código de verificação enviado para o seu email!');
    setStep(2); // Avança para a próxima etapa
  };

  // Etapa 2: Enviar o código
  const handleCodigoSubmit = (e) => {
    e.preventDefault();
    // Lógica para verificar o código com a API
    console.log(`Verificando código: ${codigo}`);
    if (codigo === '123456') { // Simulação de código correto
      alert('Código correto!');
      setStep(3); // Avança para a etapa final
    } else {
      alert('Código incorreto. Tente novamente.');
    }
  };

  // Etapa 3: Redefinir a senha
  const handleNovaSenhaSubmit = (e) => {
    e.preventDefault();
    if (novaSenha !== confirmaSenha) {
      alert('As senhas não coincidem!');
      return;
    }
    // Lógica para enviar a nova senha para a API
    console.log(`Senha redefinida com sucesso para o email: ${email}`);
    alert('Sua senha foi redefinida com sucesso!');
    navigate('/login'); // Redireciona para a página de login
  };

  return (
    <div className="redefinir-senha-container">
      {/* ETAPA 1: PEDIR O EMAIL */}
      {step === 1 && (
        <form className="redefinir-senha-card" onSubmit={handleEmailSubmit}>
          <div className="form-header">
            <h2>Esqueceu sua senha?</h2>
            <SpeechButton textToSpeak="Esqueceu sua senha?" />
          </div>
          <p>Informe seu email de cadastro para receber as instruções.</p>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="btn-submit">Enviar</button>
        </form>
      )}

      {/* ETAPA 2: PEDIR O CÓDIGO */}
      {step === 2 && (
        <form className="redefinir-senha-card" onSubmit={handleCodigoSubmit}>
          <div className="form-header">
            <h2>Verifique seu Email</h2>
            <SpeechButton textToSpeak="Verifique seu Email" />
          </div>
          <p>Enviamos um código de 6 dígitos para {email}. Por favor, insira o código abaixo.</p>
          <div className="form-group">
            <label htmlFor="codigo">Código de Verificação</label>
            <input type="text" id="codigo" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
          </div>
          <button type="submit" className="btn-submit">Verificar Código</button>
        </form>
      )}

      {/* ETAPA 3: PEDIR A NOVA SENHA */}
      {step === 3 && (
        <form className="redefinir-senha-card" onSubmit={handleNovaSenhaSubmit}>
          <div className="form-header">
            <h2>Crie uma Nova Senha</h2>
            <SpeechButton textToSpeak="Crie uma Nova Senha" />
          </div>
          <div className="form-group">
            <label htmlFor="novaSenha">Nova Senha</label>
            <input type="password" id="novaSenha" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="confirmaSenha">Confirme a Nova Senha</label>
            <input type="password" id="confirmaSenha" value={confirmaSenha} onChange={(e) => setConfirmaSenha(e.target.value)} required />
          </div>
          <button type="submit" className="btn-submit">Redefinir Senha</button>
        </form>
      )}
    </div>
  );
}

export default EsqueciSenhaPage;