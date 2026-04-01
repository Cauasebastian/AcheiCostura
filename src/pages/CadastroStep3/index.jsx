// src/pages/CadastroStep3/index.jsx - CÓDIGO CORRIGIDO

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SpeechButton from '../../components/SpeechButton';
import './style.css';

// Renomeado para CadastroStep3Page
function CadastroStep3Page() {
  const [formData, setFormData] = useState({
    tempoExperiencia: '',
    numCostureiros: '',
    disponibilidade: '',
    especialidade: '',
    maquinas: '',
    faccoes: '' // <-- CORREÇÃO 1: Adicionado o campo que faltava
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados completos do cadastro (Etapa 3):', formData);
    alert('Cadastro finalizado com sucesso!');
    // Redireciona para a página de perfil ao final de tudo
    navigate('/meu-perfil');
  };

  const textos = {
    exp: "Há quanto tempo você trabalha com costura?",
    equipe: "Quantos costureiros trabalham com você?",
    disp: "Qual seu nível de disponibilidade para produção?",
    esp: "Sua especialidade",
    maq: "Suas Máquinas",
    fac: "Sua Facção" // <-- CORREÇÃO 2: Adicionado o texto "Sua Facção"
  };

  const opcoesExp = ["De 0 a 2 anos", "De 2 a 5 anos", "De 5 a 10 anos", "Mais de 10 anos"];
  const opcoesEquipe = ["Trabalho sozinho(a)", "2 costureiros", "De 3 a 5 costureiros", "De 6 a 10 costureiros", "10 ou mais costureiros"];
  const opcoesDisp = ["Geral (Manhã e Tarde)", "Manhã", "Tarde", "Apenas Finais de semana"];

  return (
    <div className="step2-container"> {/* Pode renomear esta classe para step3-container se quiser */}
      <form className="step2-card" onSubmit={handleSubmit}> {/* Pode renomear esta classe para step3-card se quiser */}

        {/* Pergunta 1: Tempo de Experiência */}
        <div className="form-group">
          <div className="form-label-container">
            <h3>{textos.exp}</h3>
            <SpeechButton textToSpeak={textos.exp} />
          </div>
          <div className="radio-group">
            {opcoesExp.map(opcao => (
              <label key={opcao}>
                <input type="radio" name="tempoExperiencia" value={opcao} onChange={handleChange} checked={formData.tempoExperiencia === opcao} />
                {opcao}
              </label>
            ))}
          </div>
        </div>

        {/* Pergunta 2: Tamanho da Equipe */}
        <div className="form-group">
          <div className="form-label-container">
            <h3>{textos.equipe}</h3>
            <SpeechButton textToSpeak={textos.equipe} />
          </div>
          <div className="radio-group">
            {opcoesEquipe.map(opcao => (
              <label key={opcao}>
                <input type="radio" name="numCostureiros" value={opcao} onChange={handleChange} checked={formData.numCostureiros === opcao} />
                {opcao}
              </label>
            ))}
          </div>
        </div>

        {/* Pergunta 3: Disponibilidade */}
        <div className="form-group">
          <div className="form-label-container">
            <h3>{textos.disp}</h3>
            <SpeechButton textToSpeak={textos.disp} />
          </div>
          <div className="radio-group">
            {opcoesDisp.map(opcao => (
              <label key={opcao}>
                <input type="radio" name="disponibilidade" value={opcao} onChange={handleChange} checked={formData.disponibilidade === opcao} />
                {opcao}
              </label>
            ))}
          </div>
        </div>

        {/* Pergunta 4: Especialidade */}
        <div className="form-group">
          <div className="form-label-container">
            <label htmlFor="especialidade">{textos.esp}</label>
            <SpeechButton textToSpeak={textos.esp} />
          </div>
          <input type="text" id="especialidade" name="especialidade" value={formData.especialidade} onChange={handleChange} placeholder="Ex.: Malhas, modinha, bonés, etc." />
        </div>

        {/* Pergunta 5: Máquinas */}
        <div className="form-group">
          <div className="form-label-container">
            <label htmlFor="maquinas">{textos.maq}</label>
            <SpeechButton textToSpeak={textos.maq} />
          </div>
          <input type="text" id="maquinas" name="maquinas" value={formData.maquinas} onChange={handleChange} placeholder="Ex.: Reta, Overloque, ponto conjugado, etc." />
        </div>

        {/* --- INÍCIO DA CORREÇÃO 3 --- */}
        {/* Pergunta 6: Facções */}
        <div className="form-group">
          <div className="form-label-container">
            {/* O 'htmlFor' deve ser 'faccoes' (minúsculo) para ligar ao 'id' do input */}
            <label htmlFor="faccoes">{textos.fac}</label>
            <SpeechButton textToSpeak={textos.fac} />
          </div>
          <input 
            type="text" 
            id="faccoes"       // Corrigido de "Facções"
            name="faccoes"     // Corrigido de "Facções"
            value={formData.faccoes} // Corrigido de "formData.maquinas"
            onChange={handleChange} 
            placeholder="Ex.: Lavanderia, Malharia, Corte e Costura, etc." 
          />
        </div>
        {/* --- FIM DA CORREÇÃO 3 --- */}

        <button type="submit" className="btn-finalizar">Finalizar Cadastro</button>

      </form>
    </div>
  );
}

// Renomeado no export default
export default CadastroStep3Page; 