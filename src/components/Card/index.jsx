import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Ícones do Bootstrap (certifique-se de ter instalado: npm install react-bootstrap-icons)
import { StarFill, GeoAltFill, LockFill, UnlockFill, CheckCircleFill } from 'react-bootstrap-icons';
// Importe seu hook de autenticação real aqui
import { useAuth } from '../../context/AuthContext'; 
import './style.css'; // Importando o CSS acima

function Card({ 
  id, 
  imagem, 
  nome, 
  cidade, 
  avaliacao, 
  servicos, 
  premiumRequired = true,
  jaDesbloqueou = false // Nova prop: vem do banco dizendo se o user já pagou
}) {
  
  const { user, updateUser } = useAuth(); // updateUser serve para atualizar as moedas no contexto
  const navigate = useNavigate();
  
  // Estado local para controle imediato na tela
  const [desbloqueadoLocal, setDesbloqueadoLocal] = useState(jaDesbloqueou);

  // --- LÓGICA DE DECISÃO ---
  
  // 1. O usuário é assinante? (Ex: plano 'gold' ou 'pro')
  const isAssinante = user?.plano === 'gold' || user?.plano === 'pro';

  // 2. O conteúdo deve estar bloqueado?
  // Bloqueado se: Requer Premium E NÂO é assinante E NÂO desbloqueou avulso
  const isLocked = premiumRequired && !isAssinante && !desbloqueadoLocal;

  // --- AÇÕES ---

  const handleUsarMoeda = async (e) => {
    e.preventDefault(); 
    e.stopPropagation();

    // Validações básicas
    if (!user) {
        alert("Faça login para continuar.");
        navigate('/login');
        return;
    }

    if (Number(user.ac_coins) < 1) {
        if(window.confirm("Saldo insuficiente. Ir para a loja de planos?")) {
            navigate('/planos');
        }
        return;
    }

    // Confirmação
    const confirmar = window.confirm(`Gastar 1 Moeda para ver o contato de ${nome}?`);
    
    if (confirmar) {
        try {
            // --- AQUI ENTRA SUA CHAMADA API ---
            // await api.post('/desbloquear', { perfil_id: id, user_id: user.id });
            
            // Simulação de sucesso:
            setDesbloqueadoLocal(true); // Desbloqueia a tela
            console.log(`Perfil ${id} desbloqueado!`);
            
            // Opcional: Atualizar saldo visualmente no cabeçalho
            // updateUser({ ...user, ac_coins: user.ac_coins - 1 });

        } catch (error) {
            alert("Erro ao processar. Tente novamente.");
        }
    }
  };

  const handleNavegacao = (rota) => {
      navigate(rota);
  };

  return (
    <div className="card-container">
      
      {/* --- PARTE SUPERIOR: FOTO E BLOQUEIO --- */}
      <div className="card-image-wrapper">
        <img 
          src={imagem || "https://via.placeholder.com/300"} 
          alt={nome} 
          className={`card-img ${isLocked ? 'img-blur' : ''}`} 
        />
        
        {/* Mostra cadeado apenas se estiver trancado */}
        {isLocked && (
            <div className="locked-overlay">
                <LockFill size={32} />
                <span className="locked-text">Exclusivo Premium</span>
            </div>
        )}
      </div>

      {/* --- PARTE INFERIOR: TEXTOS E BOTÕES --- */}
      <div className="card-content">
        <h3 className="card-title">
          {isLocked ? "Profissional Oculto" : nome}
        </h3>

        <p className="card-location">
          <GeoAltFill className="icon-location" /> {cidade}
        </p>

        <div className="card-rating">
            <span className="rating-score">{avaliacao}</span>
            <StarFill className="icon-star" />
        </div>

        {servicos && (
            <div className="card-tags">
            {servicos.slice(0, 2).map((s, i) => (
                <span key={i} className="tag">{s}</span>
            ))}
            </div>
        )}

        {/* --- ÁREA DOS BOTÕES (Muda dinamicamente) --- */}
        <div className="card-actions">
            
            {isLocked ? (
                // CASO 1: BLOQUEADO (Mostra opções de compra)
                <div className="btns-lado-a-lado">
                    <button 
                        className="card-btn btn-assinar" 
                        onClick={() => handleNavegacao('/planos')}
                        title="Tenha acesso ilimitado"
                    >
                        <LockFill /> Assinar
                    </button>

                    <button 
                        className="card-btn btn-moeda" 
                        onClick={handleUsarMoeda}
                        title="Pague apenas por este"
                    >
                        <UnlockFill /> Usar Moeda
                    </button>
                </div>
            ) : (
                // CASO 2: LIBERADO (Mostra botão de entrar)
                <button 
                    className={`card-btn ${isAssinante ? 'btn-vip' : 'btn-ver'}`}
                    onClick={() => handleNavegacao(`/perfil/${id}`)}
                >
                    {isAssinante ? (
                        <> <CheckCircleFill /> Acessar (VIP) </>
                    ) : (
                        "Ver Perfil Completo"
                    )}
                </button>
            )}

        </div>
      </div>
    </div>
  );
}

export default Card;