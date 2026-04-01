import React, { useState } from 'react';
import './style.css';

function FeedbackForm() {
  const [comentario, setComentario] = useState("");

  const handleSubmit = (evento) => {
    evento.preventDefault(); // Impede o recarregamento da página
    alert(`Comentário enviado: "${comentario}"`); // Simula o envio
    setComentario(""); // Limpa o campo após o envio
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <h4>Deixe seu feedback</h4>
      <textarea
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        placeholder="Escreva seu comentário aqui..."
      ></textarea>
      <button type="submit">Enviar Comentário</button>
    </form>
  );
}
export default FeedbackForm;