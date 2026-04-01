import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCostureiros } from '../../data/api'; // Certifique-se de que a API está a ser importada
import StarRating from '../../components/StarRating'; // NOVO: Importe o StarRating
import './style.css'; // O seu CSS para esta página

function DetalhesCostureiroPage() {
  const { id } = useParams();
  const [costureiro, setCostureiro] = useState(null);
  const [userRating, setUserRating] = useState(0); // Estado para a avaliação do utilizador
  const [feedbackText, setFeedbackText] = useState(''); // Estado para o texto do feedback

  useEffect(() => {
    const costureiros = getCostureiros();
    const foundCostureiro = costureiros.find(c => c.id === parseInt(id));
    setCostureiro(foundCostureiro);
    // Opcional: Se o costureiro já tiver uma avaliação média, pode pré-preencher
    // setUserRating(foundCostureiro ? foundCostureiro.avaliacao : 0);
  }, [id]);

  if (!costureiro) {
    return <div>Carregando...</div>;
  }

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    // Aqui você enviaria o userRating e feedbackText para a sua API ou dados
    console.log("Avaliação enviada:", userRating);
    console.log("Feedback:", feedbackText);
    // Limpar o formulário após o envio
    setUserRating(0);
    setFeedbackText('');
    alert("Feedback enviado! (funcionalidade de backend não implementada)");
  };

  return (
    <div className="detalhes-costureiro-container">
      <div className="perfil-info">
        <img src={costureiro.imagem} alt={costureiro.nome} className="perfil-imagem" />
        <h2>{costureiro.nome}</h2>
        <p>{costureiro.profissao}</p>
        <p>Contato: {costureiro.contato}</p>
        <p>Endereço: {costureiro.endereco}</p>
        <button className="desbloquear-contato-btn">Desbloquear contato</button>
      </div>

      <div className="avaliacao-feedback-section">
        <h3>Avalie este profissional</h3>
        
        {/* NOVO: Usar o componente StarRating aqui */}
        <StarRating 
          rating={userRating} 
          onRatingChange={setUserRating} 
          allowHalf={true} // Permitir meias estrelas
        />

        <form onSubmit={handleSubmitFeedback}>
          <p>Deixe seu feedback</p>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Escreva seu comentário aqui..."
          ></textarea>
          <button type="submit" className="enviar-comentario-btn">Enviar Comentário</button>
        </form>

        <div className="feedbacks-list">
          <h3>Feedbacks</h3>
          {/* Loop pelos feedbacks existentes (se tiver no objeto costureiro) */}
          {costureiro.feedbacks && costureiro.feedbacks.map((feedback, index) => (
            <div key={index} className="feedback-item">
              <p><strong>{feedback.usuario}</strong></p>
              <p>{feedback.comentario}</p>
            </div>
          ))}
          {/* Mockup de feedbacks */}
          <div className="feedback-item">
            <p><strong>usuario_223</strong></p>
            <p>Entrega no prazo!</p>
          </div>
          <div className="feedback-item">
            <p><strong>usuario_225</strong></p>
            <p>Muito eficiente!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalhesCostureiroPage;