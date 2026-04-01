import React, { useState } from 'react';
import { useCadastro } from '../../context/CadastroContext';
import SpeechButton from '../SpeechButton';
import api from '../../data/api';
import './Step2InformacoesBasicas.css';

function Step2InformacoesBasicas({ onNext, onBack }) {
  const { userType, userId, step2Data, setStep2Data, setLoading, setError } = useCadastro();
  const [formErrors, setFormErrors] = useState({});

  const estados = [
    'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
    'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
    'SP','SE','TO'
  ];

  const couturierCategories = [
    { value: '', label: 'Selecione uma categoria' },
    { value: 'COSTUREIRA', label: 'Costureira' },
    { value: 'BORDADEIRA', label: 'Bordadeira' },
    { value: 'CORTE', label: 'Corte' },
    { value: 'ACABAMENTO', label: 'Acabamento' },
    { value: 'ESTAMPARIA', label: 'Estamparia' },
    { value: 'LAVANDERIA', label: 'Lavanderia' },
    { value: 'MODELISTA', label: 'Modelista' }
  ];

  // Opções para os selects
  const experienceOptions = [
    { value: '', label: 'Selecione' },
    { value: '0-2', label: 'De 0 a 2 anos' },
    { value: '2-5', label: 'De 2 a 5 anos' },
    { value: '5-10', label: 'De 5 a 10 anos' },
    { value: '10+', label: 'Mais de 10 anos' },
  ];

  const teamSizeOptions = [
    { value: '', label: 'Selecione' },
    { value: 'alone', label: 'Trabalho sozinho(a)' },
    { value: '2', label: '2 costureiros' },
    { value: '3-5', label: 'De 3 a 5 costureiros' },
    { value: '6-10', label: 'De 6 a 10 costureiros' },
    { value: '10+', label: '10 ou mais costureiros' },
  ];

  const availabilityOptions = [
    { value: '', label: 'Selecione' },
    { value: 'MORNING_AFTERNOON', label: 'Geral (Manhã e Tarde)' },
    { value: 'MORNING', label: 'Manhã' },
    { value: 'AFTERNOON', label: 'Tarde' },
    { value: 'WEEKENDS', label: 'Apenas Finais de semana' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStep2Data(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};

    // Validações obrigatórias
    if (userType === 'COUTURIER' && !step2Data.category) {
      errors.category = 'Categoria é obrigatória';
    }
    if (!step2Data.city.trim()) errors.city = 'Cidade é obrigatória';
    if (!step2Data.state) errors.state = 'Estado é obrigatório';
    // country e zipCode não obrigatórios, street não obrigatório (pode ser nulo)

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const updateData = {
        // Localização
        city: step2Data.city.trim(),
        state: step2Data.state,
        ...(step2Data.country && { country: step2Data.country }),
        ...(step2Data.zipCode && { zipCode: step2Data.zipCode }),
        ...(step2Data.street && { street: step2Data.street }),
        // Perfil profissional
        ...(step2Data.sewingExperienceYears && { sewingExperienceYears: step2Data.sewingExperienceYears }),
        ...(step2Data.teamSize && { teamSize: step2Data.teamSize }),
        ...(step2Data.availability && { availability: step2Data.availability }),
        ...(step2Data.specialty && { specialty: step2Data.specialty }),
        ...(step2Data.machines && { machines: step2Data.machines }),
        ...(step2Data.factionType && { factionType: step2Data.factionType }),
      };

      // Categoria (só para costureira)
      if (userType === 'COUTURIER' && step2Data.category) {
        updateData.category = step2Data.category;
      }

      await api.put(`/users/${userId}`, updateData);
      onNext();
    } catch (err) {
      setError('Erro ao salvar informações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="step-container">
      <h2>Informações Básicas e Perfil Profissional</h2>
      <p className="step-description">
        Preencha seus dados de localização e perfil profissional
      </p>

      <form onSubmit={handleSubmit}>
        {/* Categoria (apenas costureira) */}
        {userType === 'COUTURIER' && (
          <div className="form-group">
            <div className="form-label-container">
              <label htmlFor="category">Categoria Principal *</label>
              <SpeechButton textToSpeak="Categoria Principal" />
            </div>
            <select
              id="category"
              name="category"
              value={step2Data.category}
              onChange={handleChange}
              className={formErrors.category ? 'error-input' : ''}
            >
              {couturierCategories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            {formErrors.category && <span className="error-text">{formErrors.category}</span>}
          </div>
        )}

        {/* Seção Localização */}
        <div className="form-section">
          <h3>Localização</h3>
          <div className="form-group">
            <div className="form-label-container">
              <label htmlFor="city">Cidade *</label>
              <SpeechButton textToSpeak="Cidade" />
            </div>
            <input
              type="text"
              id="city"
              name="city"
              value={step2Data.city}
              onChange={handleChange}
              className={formErrors.city ? 'error-input' : ''}
              placeholder="Digite sua cidade"
            />
            {formErrors.city && <span className="error-text">{formErrors.city}</span>}
          </div>

          <div className="form-group">
            <div className="form-label-container">
              <label htmlFor="state">Estado *</label>
              <SpeechButton textToSpeak="Estado" />
            </div>
            <select
              id="state"
              name="state"
              value={step2Data.state}
              onChange={handleChange}
              className={formErrors.state ? 'error-input' : ''}
            >
              <option value="">Selecione um estado</option>
              {estados.map(uf => <option key={uf} value={uf}>{uf}</option>)}
            </select>
            {formErrors.state && <span className="error-text">{formErrors.state}</span>}
          </div>

          <div className="form-group">
            <div className="form-label-container">
              <label htmlFor="country">País</label>
              <SpeechButton textToSpeak="País" />
            </div>
            <input
              type="text"
              id="country"
              name="country"
              value={step2Data.country}
              onChange={handleChange}
              placeholder="Brasil"
            />
          </div>

          <div className="form-group">
            <div className="form-label-container">
              <label htmlFor="zipCode">CEP</label>
              <SpeechButton textToSpeak="CEP" />
            </div>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={step2Data.zipCode}
              onChange={handleChange}
              placeholder="00000-000"
            />
          </div>

          <div className="form-group">
            <div className="form-label-container">
              <label htmlFor="street">Rua</label>
              <SpeechButton textToSpeak="Rua" />
            </div>
            <input
              type="text"
              id="street"
              name="street"
              value={step2Data.street}
              onChange={handleChange}
              placeholder="Rua, número, complemento"
            />
          </div>
        </div>

        {/* Seção Perfil Profissional */}
        <div className="form-section">
          <h3>Perfil Profissional</h3>
          <div className="form-group">
            <div className="form-label-container">
              <label htmlFor="sewingExperienceYears">Experiência em costura</label>
              <SpeechButton textToSpeak="Experiência em costura" />
            </div>
            <select
              id="sewingExperienceYears"
              name="sewingExperienceYears"
              value={step2Data.sewingExperienceYears}
              onChange={handleChange}
            >
              {experienceOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          <div className="form-group">
            <div className="form-label-container">
              <label htmlFor="teamSize">Tamanho da equipe</label>
              <SpeechButton textToSpeak="Tamanho da equipe" />
            </div>
            <select
              id="teamSize"
              name="teamSize"
              value={step2Data.teamSize}
              onChange={handleChange}
            >
              {teamSizeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          <div className="form-group">
            <div className="form-label-container">
              <label htmlFor="availability">Disponibilidade</label>
              <SpeechButton textToSpeak="Disponibilidade" />
            </div>
            <select
              id="availability"
              name="availability"
              value={step2Data.availability}
              onChange={handleChange}
            >
              {availabilityOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          <div className="form-group">
            <div className="form-label-container">
              <label htmlFor="specialty">Especialidade</label>
              <SpeechButton textToSpeak="Especialidade" />
            </div>
            <input
              type="text"
              id="specialty"
              name="specialty"
              value={step2Data.specialty}
              onChange={handleChange}
              placeholder="Ex.: Malhas, modinha, bonés"
            />
          </div>

          <div className="form-group">
            <div className="form-label-container">
              <label htmlFor="machines">Máquinas</label>
              <SpeechButton textToSpeak="Máquinas" />
            </div>
            <input
              type="text"
              id="machines"
              name="machines"
              value={step2Data.machines}
              onChange={handleChange}
              placeholder="Ex.: Reta, Overloque, ponto conjugado"
            />
          </div>

          <div className="form-group">
            <div className="form-label-container">
              <label htmlFor="factionType">Tipo de facção</label>
              <SpeechButton textToSpeak="Tipo de facção" />
            </div>
            <input
              type="text"
              id="factionType"
              name="factionType"
              value={step2Data.factionType}
              onChange={handleChange}
              placeholder="Ex.: Lavanderia, Malharia, Corte e Costura"
            />
          </div>
        </div>

        <div className="form-navigation">
          <button type="button" className="btn-back" onClick={onBack}>Voltar</button>
          <button type="submit" className="btn-next">Salvar e Continuar</button>
        </div>
      </form>
    </div>
  );
}

export default Step2InformacoesBasicas;