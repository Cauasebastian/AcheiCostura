import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCadastro } from '../../context/CadastroContext';
import SpeechButton from '../SpeechButton';
import api from '../../data/api';
import ImageGalleryModal from './ImageGalleryModal';
import './Step3PerfilProfissional.css';

function Step3PerfilProfissional({ onBack }) {
  const navigate = useNavigate();
  const { userId, step3Data, setStep3Data, setLoading, error, setError, resetCadastro } = useCadastro();
  const [profileImagePreview, setProfileImagePreview] = useState(step3Data.profileImagePreview || null);
  const [otherImagesPreviews, setOtherImagesPreviews] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const otherFilesInputRef = useRef(null);

  // Estados para o modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSelectedIndex, setModalSelectedIndex] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStep3Data(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setFormErrors(prev => ({ ...prev, profileImage: 'A imagem deve ter no máximo 2MB' }));
      return;
    }
    if (!file.type.match('image.*')) {
      setFormErrors(prev => ({ ...prev, profileImage: 'Por favor, selecione uma imagem válida' }));
      return;
    }
    setStep3Data(prev => ({ ...prev, profileImage: file }));
    const reader = new FileReader();
    reader.onload = (e) => setProfileImagePreview(e.target.result);
    reader.readAsDataURL(file);
    setFormErrors(prev => ({ ...prev, profileImage: '' }));
  };

  const removeImage = () => {
    setStep3Data(prev => ({ ...prev, profileImage: null }));
    setProfileImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleOtherImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const validFiles = files.filter(file => {
      if (file.size > 2 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, otherImages: 'Cada imagem deve ter no máximo 2MB' }));
        return false;
      }
      if (!file.type.match('image.*')) {
        setFormErrors(prev => ({ ...prev, otherImages: 'Por favor, selecione apenas imagens válidas' }));
        return false;
      }
      return true;
    });
    if (validFiles.length === 0) return;

    setStep3Data(prev => ({
      ...prev,
      otherImages: [...(prev.otherImages || []), ...validFiles]
    }));
    const previews = validFiles.map(file => URL.createObjectURL(file));
    setOtherImagesPreviews(prev => [...prev, ...previews]);
    setFormErrors(prev => ({ ...prev, otherImages: '' }));
  };

  const removeOtherImage = (index) => {
    setStep3Data(prev => ({
      ...prev,
      otherImages: (prev.otherImages || []).filter((_, i) => i !== index)
    }));
    setOtherImagesPreviews(prev => prev.filter((_, i) => i !== index));
    // Se a imagem removida era a selecionada no modal, ajusta o índice
    if (modalOpen && index === modalSelectedIndex) {
      const newIndex = otherImagesPreviews.length > 1 ? Math.min(index, otherImagesPreviews.length - 2) : 0;
      setModalSelectedIndex(newIndex);
    }
  };

  const handleSubmit = async (e, action) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaving(true);

    try {
      if (step3Data.profileImage && step3Data.profileImage instanceof File) {
        const profileFormData = new FormData();
        profileFormData.append('file', step3Data.profileImage);
        await api.post('/images/profile', profileFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (step3Data.otherImages && step3Data.otherImages.length > 0) {
        const otherFormData = new FormData();
        step3Data.otherImages.forEach(file => otherFormData.append('files', file));
        await api.post('/images/others', otherFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      const updateData = {};

      if (step3Data.phone) updateData.phone = step3Data.phone.replace(/\D/g, '');
      if (step3Data.whatsapp) updateData.whatsapp = step3Data.whatsapp;
      if (step3Data.instagram) updateData.instagram = step3Data.instagram;
      if (step3Data.website) updateData.website = step3Data.website;
      if (step3Data.description) updateData.description = step3Data.description;

      if (Object.keys(updateData).length > 0) {
        await api.put(`/users/${userId}`, updateData);
      }

      if (action === 'save') {
        alert('Informações salvas com sucesso!');
      } else if (action === 'finish') {
        resetCadastro();
        navigate('/');
        alert('Cadastro concluído com sucesso!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar informações. Tente novamente.');
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };

  const handleSkip = () => {
    resetCadastro();
    navigate('/');
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 11) return `(${numbers.substring(0,2)}) ${numbers.substring(2,7)}-${numbers.substring(7)}`;
    if (numbers.length === 10) return `(${numbers.substring(0,2)}) ${numbers.substring(2,6)}-${numbers.substring(6)}`;
    return value;
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    const numbers = value.replace(/\D/g, '');
    setStep3Data(prev => ({ ...prev, [name]: numbers }));
    e.target.value = formatPhone(numbers);
  };

  // Abre o modal com a imagem clicada
  const handleOpenModal = (index) => {
    setModalSelectedIndex(index);
    setModalOpen(true);
  };

  // Callbacks passados para o modal
  const handleSelectImage = (index) => {
    setModalSelectedIndex(index);
  };

  const handleRemoveImage = (index) => {
    removeOtherImage(index);
  };

  return (
    <div className="step-container">
      <h2>Contato e Imagens</h2>
      <p className="step-description">
        Adicione suas informações de contato e imagens
        <span className="optional-badge">Opcional</span>
      </p>

      <form>
        {/* Foto de Perfil */}
        <div className="form-section">
          <h3>Foto de Perfil</h3>
          <div className="profile-image-upload">
            {profileImagePreview ? (
              <div className="image-preview">
                <img src={profileImagePreview} alt="Preview" />
                <button type="button" onClick={removeImage} className="remove-image-btn">✕</button>
              </div>
            ) : (
              <div className="upload-area">
                <input type="file" id="profileImage" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="file-input" />
                <label htmlFor="profileImage" className="upload-label">
                  <span className="upload-icon">📷</span>
                  <span>Clique para adicionar uma foto</span>
                  <small>JPG, PNG (Max: 2MB)</small>
                </label>
              </div>
            )}
            {formErrors.profileImage && <span className="error-text">{formErrors.profileImage}</span>}
          </div>
        </div>

        {/* Outras Imagens */}
        <div className="form-section">
          <h3>Outras Imagens (Portfólio)</h3>

          <div className="other-images-upload">
            <input type="file" id="otherImages" ref={otherFilesInputRef} onChange={handleOtherImagesUpload} accept="image/*" multiple className="file-input" />
            <label htmlFor="otherImages" className="upload-label">
              <span className="upload-icon">🖼️</span>
              <span>Clique para adicionar imagens</span>
              <small>Você pode selecionar várias</small>
            </label>
            {formErrors.otherImages && <span className="error-text">{formErrors.otherImages}</span>}
          </div>

          {otherImagesPreviews.length > 0 && (
            <div className="thumbnails-grid">
              {otherImagesPreviews.map((preview, index) => (
                <div key={index} className="thumbnail-item">
                  <img
                    src={preview}
                    alt={`Miniatura ${index}`}
                    className="thumbnail-image"
                    onClick={() => handleOpenModal(index)}
                  />
                  <button
                    type="button"
                    onClick={() => removeOtherImage(index)}
                    className="remove-thumbnail-btn"
                    title="Remover imagem"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de visualização */}
        <ImageGalleryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          images={otherImagesPreviews.map(preview => ({ preview }))}
          selectedIndex={modalSelectedIndex}
          onSelectImage={handleSelectImage}
          onRemoveImage={handleRemoveImage}
        />

        {/* Descrição */}
        <div className="form-section">
          <h3>Sobre você</h3>
          <div className="form-group">
            <div className="form-label-container"><label htmlFor="description">Descrição profissional</label><SpeechButton textToSpeak="Descrição profissional" /></div>
            <textarea id="description" name="description" rows="4" value={step3Data.description || ''} onChange={handleChange} placeholder="Conte um pouco sobre sua experiência..." />
            <small className="field-hint">Uma boa descrição ajuda clientes a te encontrarem</small>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-navigation">
          <button type="button" className="btn-back" onClick={onBack}>Voltar</button>
          <div className="form-actions">
            <button type="button" className="btn-save" onClick={(e) => handleSubmit(e, 'save')} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Rascunho'}
            </button>
            <button type="button" className="btn-finish" onClick={(e) => handleSubmit(e, 'finish')} disabled={saving}>
              {saving ? 'Finalizando...' : 'Finalizar Cadastro'}
            </button>
          </div>
        </div>

        <button type="button" className="btn-skip" onClick={handleSkip}>Pular esta etapa</button>
      </form>
    </div>
  );
}

export default Step3PerfilProfissional;