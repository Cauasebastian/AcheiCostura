import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getCostureiros } from '../../data/api';
import Card from '../../components/Card';
import './style.css';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  // 1. Lógica de Dados e Destaques
  const todosCostureiros = getCostureiros();
  const destaquesFiltrados = todosCostureiros.filter(c => c.isDestaque === true);
  
  // Se não houver destaques, usa os primeiros da lista como fallback
  const listaParaDestaque = destaquesFiltrados.length > 0 ? destaquesFiltrados : todosCostureiros.slice(0, 2);

  const usuariosHome = listaParaDestaque.map(u => ({
     ...u,
     foto: u.foto_url || u.imageUrl || "https://via.placeholder.com/150"
  }));

  const listaCostureiras = todosCostureiros;

  // 2. Lógica do Carrossel
  const [indexDestaque, setIndexDestaque] = useState(0);
  const mudarDestaque = (direcao) => {
    if (direcao === 'prox') {
      setIndexDestaque((prev) => (prev + 1) % usuariosHome.length);
    } else {
      setIndexDestaque((prev) => (prev - 1 + usuariosHome.length) % usuariosHome.length);
    }
  };

  const usuarioDestaque = usuariosHome[indexDestaque];

  return (
    <div className="home-container">

      {/* --- SEÇÃO DE DESTAQUE --- */}
      {usuariosHome.length > 0 && usuarioDestaque && (
        <section className="destaque-section">
          <div className="destaque-card">
            
            <button className="nav-btn prev" onClick={() => mudarDestaque('ant')}>&lt;</button>

            <div className="destaque-conteudo">
              <div className="destaque-foto-wrapper">
                <img src={usuarioDestaque.foto} alt={usuarioDestaque.nome} />
                <span className="badge-vip">⭐ Destaque</span>
              </div>
              <div className="destaque-info">
                <h3>{usuarioDestaque.nome}</h3>
                <p className="cargo">{usuarioDestaque.categoria || "Costura Geral"}</p>
                <p className="local">{usuarioDestaque.cidade}</p>
                <Link to={`/costureiros/${usuarioDestaque.id}`} className="btn-ver-perfil">
                  Ver Perfil
                </Link>
              </div>
            </div>

            <button className="nav-btn next" onClick={() => mudarDestaque('prox')}>&gt;</button>
          </div>
        </section>
      )}

      {/* --- GRID DE CARDS --- */}
      {/* IMPORTANTE: Removi a div "main-content" daqui para não duplicar margens */}
      <div className="home-grid-area">

        {/* Barra de Filtros */}
        <div className="top-bar">
          <h2 className="titulo-secao">Facções Disponíveis</h2>
          <div className="filtros-modernos">
            <div className="select-wrapper">
              <select defaultValue="">
                <option value="" disabled>Ordenar por</option>
                <option value="recentes">Mais recentes</option>
                <option value="relevancia">Relevância</option>
              </select>
            </div>
            <div className="select-wrapper">
              <select defaultValue="">
                <option value="" disabled>Filtrar por Cidade</option>
                <option value="todas">Todas as Cidades</option>
                <option value="caruaru">Caruaru</option>
                <option value="toritama">Toritama</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="cards-grid"> 
          {listaCostureiras.map((costureira) => (
            <Card
              key={costureira.id}
              id={costureira.id}
              nome={costureira.nome}
              imagem={costureira.imageUrl || costureira.foto_url} 
              cidade={costureira.cidade}
              avaliacao={costureira.nota || costureira.avaliacao || 5} 
              servicos={costureira.tags || ["Costura", "Acabamento"]} 
              premiumRequired={true} 
              jaDesbloqueou={costureira.desbloqueado_pelo_usuario || false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;