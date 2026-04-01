import React, { useState } from 'react';
import { useCadastro } from '../../context/CadastroContext';
import { useAuth } from '../../context/AuthContext';
import SpeechButton from '../SpeechButton';
import './Step1CriarConta.css';

function Step1CriarConta() {
  const { 
    setCurrentStep,
    userType, 
    setUserType,
    step1Data, 
    setStep1Data, 
    setUserId, 
    setLoading, 
    setError 
  } = useCadastro();
  
  const { register } = useAuth();
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStep1Data(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!step1Data.name.trim()) {
      errors.name = 'Nome é obrigatório';
    }

    if (!step1Data.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(step1Data.email)) {
      errors.email = 'Email inválido';
    }

    if (!step1Data.password) {
      errors.password = 'Senha é obrigatória';
    } else if (step1Data.password.length < 8) {
      errors.password = 'Senha deve ter no mínimo 8 caracteres';
    }

    if (!step1Data.confirmPassword) {
      errors.confirmPassword = 'Confirme sua senha';
    } else if (step1Data.password !== step1Data.confirmPassword) {
      errors.confirmPassword = 'As senhas não conferem';
    }

    if (!userType) {
      errors.userType = 'Selecione o tipo de conta';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;

  setLoading(true);
  setError(null);

  try {
    const userData = {
      name: step1Data.name.trim(),
      email: step1Data.email.trim(),
      password: step1Data.password,
      role: userType === 'COUTURIER' ? 'COUTURIER' : 'EMPRESA',
      type: userType === 'COUTURIER' ? 'PESSOA_FISICA' : 'PESSOA_JURIDICA'
    };

    const result = await register(userData);
    
    console.log('📦 Resultado do register:', result);
    
    // Agora result contém success e user
    if (result.success && result.user) {
      const userId = result.user.id;
      console.log('✅ ID do usuário:', userId);
      
      setUserId(userId);
      setCurrentStep(2); // Avança para o passo 2
    } else {
      setError(result.message || 'Erro ao criar conta');
    }
  } catch (err) {
    setError(err?.message || 'Erro ao criar conta. Tente novamente.');
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="step-container">
      <h2>Criar Conta</h2>
      
      <div className="user-type-selector">
        <button
          type="button"
          className={`type-button ${userType === 'COUTURIER' ? 'active' : ''}`}
          onClick={() => {
            setUserType('COUTURIER');
            setFormErrors(prev => ({ ...prev, userType: '' }));
          }}
        >
          <span className="type-icon">👕</span>
          <span>Sou Costureira</span>
        </button>
        <button
          type="button"
          className={`type-button ${userType === 'EMPRESA' ? 'active' : ''}`}
          onClick={() => {
            setUserType('EMPRESA');
            setFormErrors(prev => ({ ...prev, userType: '' }));
          }}
        >
          <span className="type-icon">🏢</span>
          <span>Sou Empresa</span>
        </button>
      </div>
      {formErrors.userType && (
        <span className="error-text">{formErrors.userType}</span>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="form-label-container">
            <label htmlFor="name">Nome Completo</label>
            <SpeechButton textToSpeak="Nome Completo" />
          </div>
          <input
            type="text"
            id="name"
            name="name"
            value={step1Data.name}
            onChange={handleChange}
            className={formErrors.name ? 'error-input' : ''}
            placeholder="Digite seu nome completo"
          />
          {formErrors.name && <span className="error-text">{formErrors.name}</span>}
        </div>

        <div className="form-group">
          <div className="form-label-container">
            <label htmlFor="email">Email</label>
            <SpeechButton textToSpeak="Email" />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={step1Data.email}
            onChange={handleChange}
            className={formErrors.email ? 'error-input' : ''}
            placeholder="seu@email.com"
          />
          {formErrors.email && <span className="error-text">{formErrors.email}</span>}
        </div>

        <div className="form-group">
          <div className="form-label-container">
            <label htmlFor="password">Senha</label>
            <SpeechButton textToSpeak="Senha" />
          </div>
          <input
            type="password"
            id="password"
            name="password"
            value={step1Data.password}
            onChange={handleChange}
            className={formErrors.password ? 'error-input' : ''}
            placeholder="Mínimo 8 caracteres"
          />
          {formErrors.password && <span className="error-text">{formErrors.password}</span>}
        </div>

        <div className="form-group">
          <div className="form-label-container">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <SpeechButton textToSpeak="Confirmar Senha" />
          </div>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={step1Data.confirmPassword}
            onChange={handleChange}
            className={formErrors.confirmPassword ? 'error-input' : ''}
            placeholder="Digite a senha novamente"
          />
          {formErrors.confirmPassword && <span className="error-text">{formErrors.confirmPassword}</span>}
        </div>

        <button type="submit" className="btn-next">
          Criar Conta e Continuar
        </button>
      </form>
    </div>
  );
}

export default Step1CriarConta;