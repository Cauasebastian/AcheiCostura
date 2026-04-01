import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SpeechButton from '../../components/SpeechButton';
import './style.css';

function CadastroStep2Page() {
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  // Estado para guardar a pré-visualização da imagem
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  // Função para lidar com a seleção da foto
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Cria uma URL temporária para a imagem selecionada para podermos exibi-la
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Em um app real, você enviaria os dados (foto, endereço) para a API
    console.log({ endereco, cidade, foto: preview });
    alert('Endereço e foto salvos! Vamos para a última etapa.');
    // Redireciona para o passo 3
    navigate('/cadastrostep3');
  };

  const textoTitulo = "Complete seu Perfil";
  const textoFoto = "Sua foto de perfil";
  const textoEndereco = "Seu Endereço";
  const textoCidade = "Sua Cidade";

  return (
    <div className="step2-container">
      <form className="step2-card" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2>{textoTitulo}</h2>
          <SpeechButton textToSpeak={textoTitulo} />
        </div>

        {/* Seção da Foto de Perfil */}
        <div className="form-group">
          <div className="form-label-container">
            <label>{textoFoto}</label>
            <SpeechButton textToSpeak={textoFoto} />
          </div>
          <div className="foto-upload-container">
            <img 
              src={preview || 'https://via.placeholder.com/150'} 
              alt="Pré-visualização do perfil" 
              className="foto-preview"
            />
            <input 
              type="file" 
              id="foto" 
              accept="image/*" // Aceita apenas arquivos de imagem
              onChange={handleFotoChange} 
            />
            <label htmlFor="foto" className="btn-upload-foto">Escolher Foto</label>
          </div>
        </div>

        {/* Seção do Endereço */}
        <div className="form-group">
          <div className="form-label-container">
            <label htmlFor="cidade">{textoCidade}</label>
            <SpeechButton textToSpeak={textoCidade} />
          </div>
          <input type="text" id="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} required />
        </div>

        <div className="form-group">
          <div className="form-label-container">
            <label htmlFor="endereco">{textoEndereco}</label>
            <SpeechButton textToSpeak={textoEndereco} />
          </div>
          <input type="text" id="endereco" value={endereco} onChange={(e) => setEndereco(e.target.value)} required />
        </div>

        <button type="submit" className="btn-avancar">Avançar</button>
      </form>
    </div>
  );
}

export default CadastroStep2Page;