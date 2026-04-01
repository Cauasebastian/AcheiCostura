import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaLock, FaQrcode, FaCreditCard, FaBarcode, FaCheckCircle } from 'react-icons/fa';
import { gerarPagamentoPix } from "../../data/api";
import './style.css';

const Pagamento = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const produto = location.state || {
    nome: "Item Desconhecido",
    preco: "R$ 0,00",
    tipo: "desconhecido",
    id: 1
  };

  const [numeroCartao, setNumeroCartao] = useState('');
  const [validade, setValidade] = useState('');
  const [cvv, setCvv] = useState('');
  const [nomeCartao, setNomeCartao] = useState('');
  const [parcelas, setParcelas] = useState(1);

  const [metodo, setMetodo] = useState('pix');
  const [loading, setLoading] = useState(false);
  const [opcoesParcelamento, setOpcoesParcelamento] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [copiaECola, setCopiaECola] = useState(null);

  useEffect(() => {
    const valorLimpo = produto.preco
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim();

    const valorNumerico = parseFloat(valorLimpo);

    if (!isNaN(valorNumerico) && valorNumerico > 0) {
      const opcoes = [];
      const parcelaMinima = 5.00;

      for (let i = 1; i <= 12; i++) {
        const valorParcela = valorNumerico / i;
        if (valorParcela < parcelaMinima && i > 1) break;

        opcoes.push({
          qtd: i,
          texto: `${i}x de R$ ${valorParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${i === 1 ? '(à vista)' : 'sem juros'}`
        });
      }
      setOpcoesParcelamento(opcoes);
    } else {
      setOpcoesParcelamento([{ qtd: 1, texto: `1x de ${produto.preco} (à vista)` }]);
    }
  }, [produto.preco]);

  const handleGerarPix = async (e) => {
    e.preventDefault();
    setLoading(true);

    const valorFormatadoAPI = parseFloat(
      produto.preco.replace("R$", "").replace(/\./g, "").replace(",", ".").trim()
    );

    const dadosEnvio = {
      planoId: produto.id,
      valor: valorFormatadoAPI
    };

    const response = await gerarPagamentoPix(dadosEnvio);

    if (response.success) {
      setQrCode(response.pixData.qrCodeBase64);
      setCopiaECola(response.pixData.codigoCopiaECola);
    } else {
      alert(response.message || "Erro ao gerar o PIX. Tente novamente.");
    }
    
    setLoading(false);
  };

  const handleFinalizar = (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Processando pagamento no Achei Costura com:", {
      numero: numeroCartao,
      validade: validade,
      codigo: cvv,
      nome: nomeCartao,
      parcelasSelecionadas: parcelas,
      produtoId: produto.id,
      valor: produto.preco
    });

    setTimeout(() => {
      setLoading(false);
      setMostrarModal(true);
    }, 2000);
  }

  const fecharModal = () => {
    setMostrarModal(false);
    navigate('/'); 
  };

  const copiarCodigo = () => {
    navigator.clipboard.writeText(copiaECola);
    alert("Código PIX copiado para a área de transferência!");
  };

  return (
    <div className="pagamento-container">
      <div className="pagamento-card">

        <div className="pagamento-header">
          <button className="btn-voltar" onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>
          <h2>Finalizar Pagamento</h2>

          <div className="resumo-compra">
            <span className="produto-nome">{produto.nome}</span>
            <span className="produto-preco">{produto.preco}</span>
          </div>

          <p className="seguranca-msg">
            <FaLock size={12} /> Ambiente Criptografado e Seguro
          </p>
        </div>

        <div className="metodos-tab">
          <button
            className={`tab-item ${metodo === 'pix' ? 'ativo' : ''}`}
            onClick={() => setMetodo('pix')}
          >
            <FaQrcode size={20} />
            <span>PIX</span>
          </button>

          <button
            className={`tab-item ${metodo === 'cartao' ? 'ativo' : ''}`}
            onClick={() => setMetodo('cartao')}
          >
            <FaCreditCard size={20} />
            <span>Cartão</span>
          </button>

          <button
            className={`tab-item ${metodo === 'boleto' ? 'ativo' : ''}`}
            onClick={() => setMetodo('boleto')}
          >
            <FaBarcode size={20} />
            <span>Boleto</span>
          </button>
        </div>

        <div className="pagamento-body">

          {metodo === 'pix' && (
            <div className="conteudo-aba fade-in">
              {!qrCode ? (
                <>
                  <div className="destaque-verde">
                    <FaCheckCircle className="icon-sucesso" />
                    <p className="titulo-destaque">Aprovação Imediata!</p>
                    <p className="desc-destaque">Libera seu acesso em segundos.</p>
                  </div>
                  <button className="btn-pagar btn-pix" onClick={handleGerarPix} disabled={loading}>
                    {loading ? "Gerando Código..." : "Gerar PIX Copia e Cola"}
                  </button>
                </>
              ) : (
                <div className="pix-gerado">
                  <h4 className="pix-titulo">Escaneie o QR Code abaixo:</h4>
                  <img 
                    src={`data:image/png;base64,${qrCode}`} 
                    alt="QR Code PIX" 
                    className="pix-qrcode-img"
                  />
                  
                  <div className="input-group pix-input-group">
                    <label>Ou copie o código abaixo:</label>
                    <div className="pix-copia-cola-container">
                      <input type="text" readOnly value={copiaECola} className="pix-input-text" />
                      <button type="button" onClick={copiarCodigo} className="btn-copiar">
                        Copiar
                      </button>
                    </div>
                  </div>

                  <button className="btn-pagar btn-pix btn-ja-paguei" onClick={() => setMostrarModal(true)}>
                    Já realizei o pagamento
                  </button>
                </div>
              )}
            </div>
          )}

          {metodo === 'cartao' && (
            <form className="conteudo-aba fade-in" onSubmit={handleFinalizar}>
              <div className="input-group">
                <label>Número do Cartão</label>
                <input 
                  type="text" 
                  placeholder="0000 0000 0000 0000" 
                  required 
                  value={numeroCartao}
                  onChange={(e) => setNumeroCartao(e.target.value)}
                />
              </div>

              <div className="row-dupla">
                <div className="input-group">
                  <label>Validade</label>
                  <input 
                    type="text" 
                    placeholder="MM/AA" 
                    required 
                    value={validade}
                    onChange={(e) => setValidade(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>CVV</label>
                  <input 
                    type="text" 
                    placeholder="123" 
                    required 
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Nome no Cartão</label>
                <input 
                  type="text" 
                  placeholder="COMO ESTÁ NO CARTÃO" 
                  required 
                  value={nomeCartao}
                  onChange={(e) => setNomeCartao(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Parcelamento</label>
                <select 
                  value={parcelas} 
                  onChange={(e) => setParcelas(e.target.value)}
                >
                  {opcoesParcelamento.map((op) => (
                    <option key={op.qtd} value={op.qtd}>{op.texto}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-pagar btn-cartao" disabled={loading}>
                {loading ? "Processando..." : "Finalizar Pedido"}
              </button>
            </form>
          )}

          {metodo === 'boleto' && (
            <div className="conteudo-aba fade-in">
              <div className="aviso-laranja">
                <strong>Atenção:</strong> Compensação em até 3 dias úteis.
              </div>
              <ul className="lista-info">
                <li>Pague em qualquer lotérica ou app bancário.</li>
                <li>Não ocupa limite do seu cartão de crédito.</li>
              </ul>
              <button className="btn-pagar btn-boleto" onClick={handleFinalizar} disabled={loading}>
                {loading ? "Gerando..." : "Gerar Boleto"}
              </button>
            </div>
          )}

        </div> 
      </div> 

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="titulo-sucesso">Pagamento Concluído! 🎉</h2>

            <p className="proposito-titulo">
              <strong>Propósito (Achei Costura):</strong>
            </p>

            <p className="proposito-texto">
              Conectar facções de costura a marcas e produtores de moda, gerando renda para quem costura e agilidade para quem confecciona.
              <br /><br />
              IMPORTANTE: O Achei Costura atua como facilitador entre as partes e não se responsabiliza pela execução dos serviços. Recomendamos que verifique referências e trabalhos anteriores do profissional antes de fechar qualquer acordo.
            </p>

            <button className="btn-continuar" onClick={fecharModal}>
              Continuar
            </button>
          </div>
        </div>
      )}

    </div> 
  );
};

export default Pagamento;