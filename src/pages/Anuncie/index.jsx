import React from 'react';
import './style.css'; // A linha que causava o erro agora vai funcionar

function AnunciePage() {
  return (
    <div className="anuncie-container">
      <h1>Crie seu Anúncio</h1>
      <p>Preencha os campos abaixo para aparecer em nossa plataforma.</p>

      <form className="anuncie-form">
        <div className="form-group">
          <label htmlFor="nome">Nome do Anunciante</label>
          <input type="text" id="nome" name="nome" placeholder="Ex: Roupas Estilosas ou João da Silva" />
        </div>

        <div className="form-group">
          <label htmlFor="categoria">Categoria ou Especialidade</label>
          <input type="text" id="categoria" name="categoria" placeholder="Ex: Modinha e Moda Praia" />
        </div>

        <div className="form-group">
          <label htmlFor="contato">Contato (Telefone/WhatsApp)</label>
          <input type="text" id="contato" name="contato" placeholder="(81) 9...." />
        </div>

        <div className="form-group">
          <label htmlFor="endereco">Endereço</label>
          <input type="text" id="endereco" name="endereco" placeholder="Rua, Número, Bairro, Cidade" />
        </div>

        <button type="submit" className="btn-enviar">
          Enviar Anúncio
        </button>
      </form>
    </div>
  );
}

export default AnunciePage;