import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEmpresaById } from '../../data/api';
import StarRating from '../../components/StarRating';
import FeedbackForm from '../../components/FeedbackForm';
import './style.css'; 

function InfoEmpresaPage() {
  const { id } = useParams();
  const [empresa, setEmpresa] = useState(null);
  const [isAssinante, setIsAssinante] = useState(false);

  useEffect(() => {
    const empresaEncontrada = getEmpresaById(id);
    setEmpresa(empresaEncontrada);
  }, [id]);

  if (!empresa) {
    return <div>Carregando informações da empresa...</div>;
  }

  const handleDesbloquear = () => {
    alert("Você precisa de um plano para ver o contato!");
  };

  return (
    <div className="detalhes-container">
      <div className="coluna-perfil">
        <img src={empresa.imageUrl} alt={empresa.nome} className="foto-perfil" />
        <h1 className="nome-perfil">{empresa.nome}</h1>
        <p className="categoria-perfil">{empresa.categoria}</p>
        
        {isAssinante ? (
          <>
            <p className="contato-perfil">Contato: {empresa.contato}</p>
            <p className="endereco-perfil">Endereço: {empresa.endereco || 'Não informado'}</p>
          </>
        ) : (
          <>
            <p className="contato-perfil">Contato: (81) 9****-****</p>
            <p className="endereco-perfil">
              Endereço: {empresa.endereco ? `${empresa.endereco.substring(0, 10)}********` : 'Endereço protegido'}
            </p>
            <button className="btn-desbloquear" onClick={handleDesbloquear}>
              Desbloquear contato
            </button>
          </>
        )}
      </div>
      <div className="coluna-feedbacks">
        <div className="avaliacao">
          <h2>Avalie esta empresa</h2>
          <StarRating /> 
        </div>
        <FeedbackForm />
        <div className="feedbacks-lista">
          <h3>Feedbacks</h3>
          
          <div className="feedback-item">
            <div className="feedback-usuario-avatar"></div>
            <div className="feedback-conteudo">
              <strong className="feedback-usuario-nome">usuario_301</strong>
              <span className="feedback-texto">Ótimo atendimento!</span>
            </div>
          </div>
          <div className="feedback-item">
            <div className="feedback-usuario-avatar"></div>
            <div className="feedback-conteudo">
              <strong className="feedback-usuario-nome">usuario_405</strong>
              <span className="feedback-texto">Preços justos e qualidade.</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default InfoEmpresaPage;