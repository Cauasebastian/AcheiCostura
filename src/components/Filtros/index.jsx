import React from 'react';
// Sem import de StarRating
import './style.css'; 

function Filtros({ selectedCity, setSelectedCity, sortBy, setSortBy }) {
  const cidades = ["Todas as Cidades", "Caruaru - PE", "Toritama - PE", "Santa Cruz do Capibaribe - PE"];
  
  return (
    <div className="filtros-container-simplificado">
      <h3 className="filtros-titulo">Facções Disponíveis</h3>

      <div className="filtros-agrupados">
        
        <select 
          className="location-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Ordenar por...</option>
          <option value="MAIS_AVALIADOS">Mais Avaliados</option>
          <option value="MENOS_AVALIADOS">Menos Avaliados</option>
        </select>

        <div className="location-select-container">
          <select 
            className="location-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value === "Todas as Cidades" ? "" : e.target.value)}
          >
            {cidades.map(cidade => (
              <option key={cidade} value={cidade}>
                {cidade}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default Filtros;