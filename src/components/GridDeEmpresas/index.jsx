import React from 'react';
import Card from '../Card';
import './style.css';

function GridDeEmpresas({ empresas, tipo }) {
  console.log("2. GridDeEmpresas recebeu o tipo:", tipo);
  if (!empresas || empresas.length === 0) {
    return <p>Ninguém foi encontrado.</p>;
  }

  return (
    <div className="grid-container">
      {empresas.map(item => (
        <Card key={item.id} item={item} tipo={tipo} />
      ))}
    </div>
  );
}

export default GridDeEmpresas;