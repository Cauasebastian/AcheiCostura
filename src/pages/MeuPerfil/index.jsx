// Em: src/pages/MeuPerfil/index.jsx

import React, { useState, useEffect, useRef } from 'react';
import './style.css';

const dadosDoUsuarioLogado = {
  nome: 'Gabriel Batista',
  email: 'gabriel.b@email.com',
  contato: '(81) 94589-****',
  cidade: 'Caruaru - PE',
  endereco: 'Rua Governador, 123, Centro, Caruaru',
  especialidade: 'Moda Praia, Lingerie, Jeans',
  habilidadeMaquina: 'Máquina Reta, Overloque',
  anosExperiencia: '4 a 6 anos',
  imageUrl: 'https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  portfolio: []
};

function MeuPerfilPage() {
  const [perfil, setPerfil] = useState({ portfolio: [] });
  
  // Referências para os inputs de arquivo escondidos
  const profilePicInputRef = useRef(null);
  const portfolioInputRef = useRef(null);

  const opcoesExperiencia = ["0 a 2 anos", "2 a 4 anos", "4 a 6 anos", "6 a 8 anos", "8 a 10 anos", "Mais de 10 anos"];

  useEffect(() => {
    setPerfil(dadosDoUsuarioLogado);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerfil(prev => ({ ...prev, [name]: value }));
  };

  // --- LÓGICA DE TROCAR FOTO DE PERFIL ---
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Cria uma URL temporária para mostrar a imagem imediatamente
      const imageUrl = URL.createObjectURL(file);
      setPerfil(prev => ({ ...prev, imageUrl: imageUrl }));
    }
  };

  // --- LÓGICA DE ADICIONAR AO PORTFÓLIO (ARQUIVO) ---
  const handlePortfolioFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Deteta se é imagem ou vídeo pelo tipo do arquivo
    const fileType = file.type.startsWith('video/') ? 'video' : 'foto';
    const fileUrl = URL.createObjectURL(file);

    const novoItem = { type: fileType, url: fileUrl };

    setPerfil(prev => ({
      ...prev,
      portfolio: [...(prev.portfolio || []), novoItem]
    }));

    // Limpa o input para permitir selecionar o mesmo arquivo novamente se quiser
    e.target.value = null;
  };

  const handleRemoveItem = (indexToRemove) => {
    setPerfil(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Perfil atualizado com sucesso!');
    console.log('Dados finais:', perfil);
  };

  return (
    <div className="meu-perfil-container">
      <h1 className="titulo-pagina">Meu Perfil</h1>
      
      {/* --- ÁREA DA FOTO DE PERFIL --- */}
      <div className="foto-perfil-wrapper">
        <div className="foto-perfil-container">
          <img src={perfil.imageUrl} alt="Foto de Perfil" className="foto-perfil-grande" />
          
          {/* Botão para trocar foto */}
          <button 
            type="button" 
            className="btn-trocar-foto"
            onClick={() => profilePicInputRef.current.click()}
            title="Alterar foto de perfil"
          >
            📷
          </button>
          
          {/* Input invisível */}
          <input 
            type="file" 
            ref={profilePicInputRef} 
            onChange={handleProfilePicChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="perfil-card">
        <h2>Biografia</h2>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nome">Seu Nome:</label>
            <input type="text" id="nome" name="nome" value={perfil.nome || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="especialidade">Especialidade:</label>
            <textarea id="especialidade" name="especialidade" value={perfil.especialidade || ''} onChange={handleChange}></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="contato">Contato:</label>
            <input type="text" id="contato" name="contato" value={perfil.contato || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="habilidadeMaquina">Habilidade com Máquina:</label>
            <textarea id="habilidadeMaquina" name="habilidadeMaquina" value={perfil.habilidadeMaquina || ''} onChange={handleChange}></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="cidade">Sua cidade:</label>
            <input type="text" id="cidade" name="cidade" value={perfil.cidade || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="anosExperiencia">Anos de Experiência:</label>
            <select id="anosExperiencia" name="anosExperiencia" value={perfil.anosExperiencia || ''} onChange={handleChange}>
              <option value="" disabled>Selecione uma opção</option>
              {opcoesExperiencia.map(opcao => <option key={opcao} value={opcao}>{opcao}</option>)}
            </select>
          </div>
          <div className="form-group full-width">
            <label htmlFor="endereco">Endereço:</label>
            <input type="text" id="endereco" name="endereco" value={perfil.endereco || ''} onChange={handleChange} />
          </div>
        </div>

        {/* --- SECÇÃO DE PORTFÓLIO --- */}
        <div className="portfolio-manager-section">
          <h2>Portfólio (Fotos e Vídeos)</h2>
          <p className="helper-text">Mostre o seu trabalho! Clique abaixo para adicionar fotos ou vídeos do seu computador.</p>

          <div className="add-item-box-file">
            {/* Input de arquivo invisível para o portfólio */}
            <input 
              type="file" 
              ref={portfolioInputRef}
              onChange={handlePortfolioFileChange}
              accept="image/*,video/*" 
              style={{ display: 'none' }}
            />

            <button 
              type="button" 
              className="btn-upload-portfolio"
              onClick={() => portfolioInputRef.current.click()}
            >
              <span className="upload-icon">📁</span>
              Escolher Arquivo (Foto ou Vídeo)
            </button>
          </div>

          <div className="portfolio-preview-grid">
            {perfil.portfolio && perfil.portfolio.map((item, index) => (
              <div key={index} className="preview-card">
                <button 
                  type="button" 
                  className="btn-remove" 
                  onClick={() => handleRemoveItem(index)}
                  title="Remover"
                >
                  &times;
                </button>
                
                {item.type === 'video' ? (
                  <div className="video-thumb">
                    <span className="play-icon">▶</span>
                    <video src={item.url} /> 
                  </div>
                ) : (
                  <img src={item.url} alt="Trabalho" />
                )}
                <span className="type-label">{item.type === 'foto' ? '📷 Foto' : '🎥 Vídeo'}</span>
              </div>
            ))}
            
            {(!perfil.portfolio || perfil.portfolio.length === 0) && (
              <p className="empty-msg">Nenhum item adicionado ainda.</p>
            )}
          </div>
        </div>

        <button type="submit" className="btn-salvar">Salvar Alterações</button>
      </form>
    </div>
  );
}

export default MeuPerfilPage;