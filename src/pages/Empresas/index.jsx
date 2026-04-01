import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GridDeItens from '../../components/GridDeItens';
import Filtros from '../../components/Filtros';
import AnuncioCarrossel from '../../components/AnuncioCarrossel';
import { getEmpresas } from '../../data/api';
import './style.css';

function EmpresasPage() {
  const [empresas, setEmpresas] = useState([]);
  const [filtros, setFiltros] = useState({ localizacao: 'Todas' });
  const navigate = useNavigate();

  useEffect(() => {
    setEmpresas(getEmpresas());
  }, []);

  const handleFiltroChange = (nomeDoFiltro, valor) => {
    setFiltros(filtrosAnteriores => ({ ...filtrosAnteriores, [nomeDoFiltro]: valor }));
  };

  const empresasFiltradas = empresas.filter(empresa => {
    const passouNoFiltroDeLocalizacao = 
      filtros.localizacao === 'Todas' || empresa.cidade === filtros.localizacao;
    return passouNoFiltroDeLocalizacao;
  });

  const irParaCostureiros = () => {
    navigate('/costureiros');
  };

  return (
    <main className="main-content">
      <AnuncioCarrossel />

      <div className="filtros-section">
        <div className="tipo-filtros">
          <button className="tipo-btn active">Empresas</button>
          <button className="tipo-btn" onClick={irParaCostureiros}>
            Costureiro
          </button>
        </div>
        <Filtros 
          filtrosAtuais={filtros}
          onFiltroChange={handleFiltroChange}
          itens={empresas} // Passando os itens para o filtro
        />
      </div>

      {/* USANDO O NOVO COMPONENTE COM A PROP "itens" */}
      <GridDeItens itens={empresasFiltradas} tipo="empresas" />
    </main>
  );
}

export default EmpresasPage;