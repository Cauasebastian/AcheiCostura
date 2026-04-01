import React from 'react';
import { useNavigate } from 'react-router'; // Importante para o redirecionamento
import { FaCheck, FaStar, FaCoins } from 'react-icons/fa'; 
import SpeechButton from '../../components/SpeechButton';
import coinImg from "../../assets/coins.png"; // Imagem de moeda personalizada
import './style.css';

const PlanosPage = () => {
  const navigate = useNavigate();
  
  // Textos para o SpeechButton (Mantive os seus originais)
  const textoPlanoMensal = "Plano Mensal. Benefícios: Desbloqueie todos os contatos por 1 mês. Navegação sem anúncios de terceiros. Ideal para projetos rápidos.";
  const textoPlanoTrimestral = "Plano Trimestral. Benefícios: Desbloqueie todos os contatos por 3 meses. Sem anúncios. Suporte prioritário. Ótimo custo-benefício.";
  const textoPlanoSemestral = "Plano Semestral. Benefícios: Desbloqueie todos os contatos por 6 meses. Sem anúncios. Suporte prioritário. Máxima economia.";
  const textoPlanoAnual = "Plano Anual. Benefícios: Acesso anual completo. Suporte Premium. Navegação sem anúncios.";
  const textoCoins = "Comprar AC Coins. Compre moedas para desbloquear facções individualmente. Sem mensalidade.";
  const textoCarrossel = "Anúncio Destaque. Sua marca no topo da página inicial com alta visibilidade. Foto Gigante. 7 dias de Destaque.";

  // --- FUNÇÃO DE NAVEGAÇÃO CORRIGIDA ---
  // Agora aponta para '/pagamento' (singular), igual ao seu AppRoutes
  const handleComprar = (nome, preco, tipo, dias = null) => {
    navigate('/pagamento', { 
      state: { 
        nome: nome, 
        preco: preco, 
        tipo: tipo,    // 'assinatura', 'moeda' ou 'anuncio_destaque'
        dias: dias     // Só vai preenchido se for o carrossel
      } 
    });
  };

  return (
    <div className="planos-container">
      
      <div className="planos-header">
        <h1 className="titulo-principal">Nossos Planos</h1>
        <p className="subtitulo">Escolha a melhor opção para o seu negócio</p>
      </div>

      <div className="planos-grid">
        
        {/* 1. MENSAL */}
        <div className="plano-card">
          <div className="card-top-actions">
             <SpeechButton textToSpeak={textoPlanoMensal} />
          </div>
          <div className="plano-nome">Mensal</div>
          <p className="plano-desc">Ideal para projetos rápidos.</p>
          <hr />
          <ul className="lista-beneficios">
            <li><FaCheck className="icon-check" /> Acesso total por 1 mês</li>
            <li><FaCheck className="icon-check" /> Contatos liberados</li>
            <li className="inativo">Sem anúncios</li>
          </ul>
          <button 
            className="btn-plano btn-outline"
            onClick={() => handleComprar("Plano Mensal", "R$ 29,90", "assinatura")}
          >
            Assinar Agora
          </button>
        </div>

        {/* 2. TRIMESTRAL */}
        <div className="plano-card destaque">
          <div className="badge-recomendado"><FaStar /> Mais Popular</div>
          <div className="card-top-actions">
             <SpeechButton textToSpeak={textoPlanoTrimestral} />
          </div>
          <div className="plano-nome">Trimestral</div>
          <p className="plano-desc">Ótimo custo-benefício.</p>
          <hr />
          <ul className="lista-beneficios">
            <li><FaCheck className="icon-check" /> Acesso por 3 meses</li>
            <li><FaCheck className="icon-check" /> <strong>Sem anúncios</strong></li>
            <li><FaCheck className="icon-check" /> Suporte Prioritário</li>
          </ul>
          <button 
            className="btn-plano btn-cheio"
            onClick={() => handleComprar("Plano Trimestral", "R$ 79,90", "assinatura")}
          >
            Assinar Agora
          </button>
        </div>

        {/* 3. SEMESTRAL */}
        <div className="plano-card">
          <div className="card-top-actions">
             <SpeechButton textToSpeak={textoPlanoSemestral} />
          </div>
          <div className="plano-nome">Semestral</div>
          <p className="plano-desc">Máxima economia.</p>
          <hr />
          <ul className="lista-beneficios">
            <li><FaCheck className="icon-check" /> Acesso por 6 meses</li>
            <li><FaCheck className="icon-check" /> Sem anúncios</li>
            <li><FaCheck className="icon-check" /> Suporte Prioritário</li>
          </ul>
          <button 
            className="btn-plano btn-outline"
            onClick={() => handleComprar("Plano Semestral", "R$ 149,90", "assinatura")}
          >
            Assinar Agora
          </button>
        </div>

        {/* 4. ANUAL */}
        <div className="plano-card">
          <div className="card-top-actions">
             <SpeechButton textToSpeak={textoPlanoAnual} />
          </div>
          <div className="plano-nome">Anual</div>
          <p className="plano-desc">Acesso completo o ano todo.</p>
          <hr />
          <ul className="lista-beneficios">
            <li><FaCheck className="icon-check" /> 1 ano de acesso</li>
            <li><FaCheck className="icon-check" /> Suporte Premium</li>
            <li><FaCheck className="icon-check" /> Novidades antecipadas</li>
          </ul>
          <button 
            className="btn-plano btn-outline"
            onClick={() => handleComprar("Plano Anual", "R$ 290,00", "assinatura")}
          >
            Assinar Agora
          </button>
        </div>

        {/* 5. AC COINS */}
        <div className="plano-card card-coins-style">
          <div className="card-top-actions">
             <SpeechButton textToSpeak={textoCoins} />
          </div>
          <div className="plano-nome">AC COINS</div>
          
          <div className="img-coins-wrapper">
            <img src={coinImg} alt="Moedas" />
          </div>

          <p className="plano-desc">Pague apenas pelo que usar.</p>
          <hr />
          <ul className="lista-beneficios">
            <li><FaCoins className="icon-check gold" /> 1 Moeda = 1 Desbloqueio</li>
            <li><FaCheck className="icon-check" /> Sem mensalidade</li>
            <li><FaCheck className="icon-check" /> As moedas não expiram</li>
          </ul>
          
          <button 
            className="btn-plano btn-gold"
            onClick={() => handleComprar("Pacote AC Coins", "R$ 10,00", "moeda")}
          >
            Comprar Moedas
          </button>
        </div>

        {/* 6. CARROSSEL (DESTAQUE) */}
        <div className="plano-card">
          <div className="badge-recomendado" style={{ backgroundColor: '#e74c3c' }}>🚀 Destaque Extra</div>
          <div className="card-top-actions">
             {/* 6. CARROSSEL (DESTAQUE) <SpeechButton textToSpeak={textoCarrossel} /> */}
          </div>
          <div className="plano-nome">Seu Anuncio</div>
          <p className="plano-desc">Sua marca no topo da Home.</p>
          <hr />
          <ul className="lista-beneficios">
            <li><FaCheck className="icon-check" /> Foto Gigante na Home</li>
            <li><FaCheck className="icon-check" /> 7 dias de Destaque</li>
            <li><FaCheck className="icon-check" /> Alta Visibilidade</li>
          </ul>
          
          {/* Botão configurado para Destaque */}
          <button 
            className="btn-plano btn-cheio"
            onClick={() => handleComprar("Destaque Carrossel", "R$ 49,90", "anuncio_destaque", 7)}
          >
            Quero Destacar
          </button>
        </div>

      </div>
    </div>
  );
};

export default PlanosPage;