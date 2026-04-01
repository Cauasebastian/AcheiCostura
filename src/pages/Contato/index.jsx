import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import SpeechButton from '../../components/SpeechButton'; // Importando o botão
import './style.css';

const ContatoPage = () => {
  // Texto para narração
  const textoContato = `
    Fale Conosco. Tem alguma dúvida ou sugestão? Estamos aqui para ajudar.
    Nossas informações de contato são:
    Telefone: 81 99999-9999.
    E-mail: contato@acheicostura.com.br.
    Estamos localizados em Caruaru, Pernambuco.
    Ou preencha o formulário ao lado com seu nome, e-mail e mensagem que retornaremos assim que possível.
  `;

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: 'Duvida', // Valor padrão para evitar warning no React
    mensagem: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Mensagem enviada com sucesso! (Simulação)');
    setFormData({ nome: '', email: '', assunto: 'Duvida', mensagem: '' });
  };

  return (
    <div className="contato-container">

      {/* Cabeçalho Simples com Áudio */}
      <div className="contato-header">
        <h1>Fale Conosco</h1>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
          <SpeechButton textToSpeak={textoContato} />
        </div>
        <p>Tem alguma dúvida ou sugestão? Estamos aqui para ajudar.</p>
      </div>

      <div className="contato-content">

        {/* Lado Esquerdo: Informações */}
        <div className="info-box">
          <h3>Informações de Contato</h3>
          <p className="info-desc">
            Preencha o formulário e nossa equipe entrará em contato em até 24 horas.
          </p>

          <div className="info-item">
            <FaPhoneAlt className="icon" />
            <span>(81) 99999-9999</span>
          </div>

          <div className="info-item">
            <FaEnvelope className="icon" />
            <span>contato@acheicostura.com.br</span>
          </div>

          <div className="info-item">
            <FaMapMarkerAlt className="icon" />
            <span>Caruaru, Pernambuco - PE</span>
          </div>

          <div className="social-media">
            <p>Siga-nos:</p>
            <div className="social-icons">
              <a href="https://www.instagram.com/achei_costura/" className="social-link"><FaInstagram /></a>
              <a href="#" className="social-link"><FaWhatsapp /></a>
            </div>
          </div>
        </div>

        {/* Lado Direito: Formulário */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Seu Nome</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: João da Silva"
              required
            />
          </div>

          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ex: joao@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Assunto</label>
            <select name="assunto" value={formData.assunto} onChange={handleChange}>
              <option value="Duvida">Dúvida</option>
              <option value="Parceria">Parceria</option>
              <option value="Suporte">Suporte Técnico</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="form-group">
            <label>Mensagem</label>
            <textarea
              name="mensagem"
              rows={4}
              value={formData.mensagem}
              onChange={handleChange}
              placeholder="Escreva sua mensagem aqui..."
              required
            ></textarea>
          </div>

          <button type="submit" className="btn-enviar">Enviar Mensagem</button>
        </form>

      </div>
    </div>
  );
};

export default ContatoPage;