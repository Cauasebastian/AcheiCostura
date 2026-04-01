import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCostureiroById } from '../../data/api';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/StarRating';
import coinsImg from '../../assets/coins.png'; // Importe a imagem da moeda
import './style.css';

function InfoCostureiroPage() {
  const { id } = useParams();
  const { user, gastarMoeda } = useAuth();
  
  const [costureiro, setCostureiro] = useState(null);
  const [contatoVisivel, setContatoVisivel] = useState(false);
  const [activeTab, setActiveTab] = useState('sobre'); // Estado para controlar a aba ativa

  useEffect(() => {
    const data = getCostureiroById(id);
    setCostureiro(data);
  }, [id]);

  if (!costureiro) return <div className="loading">Carregando...</div>;

  // Lógica para desbloquear o contato
  const handleDesbloquear = () => {
    if (!user) {
      alert("Você precisa fazer login para usar suas moedas.");
      return;
    }

    if (gastarMoeda()) {
      setContatoVisivel(true);
      alert(`Contato desbloqueado! Você agora tem ${user.coins - 1} coins.`);
    } else {
      alert("Saldo insuficiente! Compre mais coins na página de Planos.");
    }
  };

  // Mock de dados para o Portfólio (já que não temos na API ainda)
  const portfolioItems = [
    { type: 'foto', url: 'https://images.pexels.com/photos/461035/pexels-photo-461035.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { type: 'foto', url: 'https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { type: 'foto', url: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { type: 'video', url: 'https://videos.pexels.com/video-files/4325372/4325372-hd_1920_1080_30fps.mp4' }, // Exemplo de vídeo
    { type: 'foto', url: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=600' },
  ];

  return (
    <div className="info-costureiro-container">
      {/* Cabeçalho do Perfil */}
      <div className="perfil-header">
        <img src={costureiro.imageUrl} alt={costureiro.nome} className="perfil-avatar" />
        <div className="perfil-dados">
          <h1>{costureiro.nome}</h1>
          <p className="categoria">{costureiro.categoria}</p>
          <p className="localizacao">📍 {costureiro.cidade}</p>
          <div className="rating-display">
            <span>Avaliação: </span>
            <span className="stars">{'★'.repeat(costureiro.avaliacao)}</span>
            <span>({costureiro.avaliacao}.0)</span>
          </div>
        </div>
      </div>

      {/* --- SISTEMA DE ABAS --- */}
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'sobre' ? 'active' : ''}`}
          onClick={() => setActiveTab('sobre')}
        >
          Sobre
        </button>
        <button 
          className={`tab-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveTab('portfolio')}
        >
          Portfólio (Trabalhos)
        </button>
      </div>

      {/* --- CONTEÚDO DAS ABAS --- */}
      <div className="tab-content">
        
        {/* ABA 1: SOBRE E CONTATO */}
        {activeTab === 'sobre' && (
          <div className="sobre-section animate-fade">
            <div className="info-card">
              <h3>Informações de Contato</h3>
              
              {contatoVisivel ? (
                <div className="contato-revelado">
                  <p><strong>Whatsapp:</strong> {costureiro.contato.replace('****', '9876')}</p>
                  <p><strong>Email:</strong> contato@exemplo.com</p>
                  <p><strong>Endereço:</strong> {costureiro.endereco}</p>
                  <div className="sucesso-msg">✔ Contato liberado!</div>
                </div>
              ) : (
                <div className="bloqueio-area">
                  <p className="blur-text">{costureiro.contato}</p>
                  <p className="aviso-bloqueio">Informações de contato ocultas</p>
                  
                  <div className="unlock-options">
                    <button onClick={handleDesbloquear} className="btn-unlock coin-unlock">
                      <img src={coinsImg} alt="Coin" />
                      Desbloquear com 1 Coin
                    </button>
                    
                    <Link to="/planos" className="btn-link-planos">
                      Não tem coins? Comprar agora
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Seção de Avaliação do Usuário */}
            <div className="user-rating-section">
              <h3>Avalie este profissional</h3>
              <StarRating rating={0} onRatingChange={() => {}} allowHalf={true} />
            </div>
          </div>
        )}

        {/* ABA 2: PORTFÓLIO (FOTOS E VÍDEOS) */}
        {activeTab === 'portfolio' && (
          <div className="portfolio-section animate-fade">
            <h3>Trabalhos Recentes</h3>
            <div className="portfolio-grid">
              {portfolioItems.map((item, index) => (
                <div key={index} className="portfolio-item">
                  {item.type === 'video' ? (
                    <div className="video-wrapper">
                      <video controls>
                        <source src={item.url} type="video/mp4" />
                        Seu navegador não suporta vídeos.
                      </video>
                      <span className="type-badge video">Vídeo</span>
                    </div>
                  ) : (
                    <div className="image-wrapper">
                      <img src={item.url} alt={`Trabalho ${index}`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default InfoCostureiroPage;