// contexts/CadastroContext.js
import React, { createContext, useState, useContext } from 'react';

const CadastroContext = createContext();

export const useCadastro = () => {
  const context = useContext(CadastroContext);
  if (!context) {
    throw new Error('useCadastro deve ser usado dentro de CadastroProvider');
  }
  return context;
};

export const CadastroProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Step 1
  const [step1Data, setStep1Data] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Step 2 - Informações Básicas + Perfil Profissional
  const [step2Data, setStep2Data] = useState({
    // Localização
    city: '',
    state: '',
    country: '',
    zipCode: '',
    street: '',
    // Perfil Profissional
    sewingExperienceYears: '',
    teamSize: '',
    availability: '',
    specialty: '',
    machines: '',
    factionType: '',
    category: '' // categoria (costureira)
  });

  // Step 3 - Contato e Imagens
  const [step3Data, setStep3Data] = useState({
    phone: '',
    whatsapp: '',
    instagram: '',
    website: '',
    description: '',
    profileImage: null,
    otherImages: []
  });

  const resetCadastro = () => {
    setCurrentStep(1);
    setUserType(null);
    setUserId(null);
    setStep1Data({ name: '', email: '', password: '', confirmPassword: '' });
    setStep2Data({
      city: '', state: '', country: '', zipCode: '', street: '',
      sewingExperienceYears: '', teamSize: '', availability: '',
      specialty: '', machines: '', factionType: '', category: ''
    });
    setStep3Data({
      phone: '', whatsapp: '', instagram: '', website: '',
      description: '', profileImage: null, otherImages: []
    });
    setError(null);
  };

  const value = {
    currentStep, setCurrentStep,
    userType, setUserType,
    userId, setUserId,
    loading, setLoading,
    error, setError,
    step1Data, setStep1Data,
    step2Data, setStep2Data,
    step3Data, setStep3Data,
    resetCadastro
  };

  return (
    <CadastroContext.Provider value={value}>
      {children}
    </CadastroContext.Provider>
  );
};