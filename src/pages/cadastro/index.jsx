// src/pages/CadastroPage/index.jsx
import React from 'react';
import { CadastroProvider, useCadastro } from "../../context/CadastroContext";
import Step1CriarConta from '../../components/cadastro/Step1CriarConta';
import Step2InformacoesBasicas from '../../components/cadastro/Step2InformacoesBasicas';
import Step3PerfilProfissional from '../../components/cadastro/Step3PerfilProfissional';
import './style.css';

function CadastroContent() {
  const { currentStep, setCurrentStep, loading, error } = useCadastro();

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        
        {/* === NOSSA NOVA BARRA DE PROGRESSO DE 3 PASSOS === */}
        <div className="stepper-container">
          {/* Passo 1 */}
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="circle">1</div>
            <span>CRIAR CONTA</span>
          </div>

          <div className={`line ${currentStep >= 2 ? 'active-line' : ''}`}></div>

          {/* Passo 2 */}
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="circle">2</div>
            <span>INFO BÁSICAS</span>
          </div>

          <div className={`line ${currentStep >= 3 ? 'active-line' : ''}`}></div>

          {/* Passo 3 */}
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="circle">3</div>
            <span>PERFIL</span>
          </div>
        </div>
        {/* ================================================= */}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}

        {currentStep === 1 && (
          <Step1CriarConta onNext={handleNextStep} />
        )}

        {currentStep === 2 && (
          <Step2InformacoesBasicas 
            onNext={handleNextStep} 
            onBack={handlePreviousStep}
          />
        )}

        {currentStep === 3 && (
          <Step3PerfilProfissional onBack={handlePreviousStep} />
        )}
      </div>
    </div>
  );
}

function CadastroPage() {
  return (
    <CadastroProvider>
      <CadastroContent />
    </CadastroProvider>
  );
}

export default CadastroPage;