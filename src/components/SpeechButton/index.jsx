import React, { useCallback } from 'react';
import { VolumeUp } from 'react-bootstrap-icons';
import './style.css';

function SpeechButton({ textToSpeak }) {

  const handleSpeak = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'pt-BR';
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Desculpe, seu navegador não suporta a funcionalidade de leitura de texto.');
    }
  }, [textToSpeak]);

  return (
    // AQUI ESTÁ A CORREÇÃO: Adicionamos type="button"
    <button type="button" onClick={handleSpeak} className="speech-button" title="Ouvir o texto">
      <VolumeUp size={18} />
    </button>
  );
}

export default SpeechButton;