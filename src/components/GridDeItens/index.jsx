import React from 'react';
import Card from '../Card'; 
import './style.css';

// O nome da função e da prop agora são genéricos
function GridDeItens({ itens, tipo }) {
  if (!itens || itens.length === 0) {
    return <p>Nenhum item encontrado.</p>;
  }

  return (
    <div className="grid-container">
      {itens.map(item => (
        <Card key={item.id} item={item} tipo={tipo} />
      ))}
    </div>
  );
}

export default GridDeItens;