import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Cria uma instância do axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Serviço de Autenticação
export const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.data.token) {
        // Armazena o token de forma segura
        localStorage.setItem('token', response.data.token);

        // Busca os dados do usuário
        const userResponse = await api.get('/users/me');
        localStorage.setItem('user', JSON.stringify(userResponse.data));

        return {
          success: true,
          user: userResponse.data,
          token: response.data.token
        };
      }
      return { success: false, message: 'Token não recebido' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao fazer login'
      };
    }
  },

  async register(userData) {
    try {
      console.log('📝 Iniciando cadastro para:', userData.email);
      console.log('📦 Dados enviados:', JSON.stringify(userData, null, 2));

      // 1. Primeiro faz o cadastro
      const registerResponse = await api.post('/auth/register', userData);

      console.log('📨 Resposta do cadastro:', registerResponse.data);

      // Verifica se o cadastro foi bem-sucedido
      if (registerResponse.data && registerResponse.data.id) {
        console.log('✅ Cadastro realizado com sucesso');

        // 2. Faz login automaticamente
        try {
          const loginResponse = await api.post('/auth/login', {
            email: userData.email,
            password: userData.password
          });

          console.log('🔑 Resposta do login:', loginResponse.data);

          if (loginResponse.data.token) {
            const token = loginResponse.data.token;
            localStorage.setItem('token', token);

            // 3. Busca os dados completos do usuário usando o ID retornado
            let userDataResponse;
            try {
              // Tenta buscar pelo endpoint específico do usuário
              const userResponse = await api.get(`/users/${registerResponse.data.id}`);
              userDataResponse = userResponse.data;
              console.log('👤 Dados do usuário obtidos:', userDataResponse);
            } catch (userError) {
              console.warn('⚠️ Não foi possível obter dados completos, usando dados básicos');
              // Usa os dados retornados no registro
              userDataResponse = registerResponse.data;
            }

            // Armazena os dados do usuário
            localStorage.setItem('user', JSON.stringify(userDataResponse));

            console.log('✅ Login automático realizado');

            return {
              success: true,
              user: userDataResponse,
              token: token,
              message: 'Cadastro realizado com sucesso!'
            };
          }
        } catch (loginError) {
          console.warn('⚠️ Login automático falhou, mas cadastro foi realizado');
          // Mesmo se o login falhar, o cadastro foi realizado
          return {
            success: true,
            message: 'Cadastro realizado com sucesso! Por favor, faça login.',
            user: registerResponse.data
          };
        }
      } else {
        console.error('❌ Cadastro falhou - resposta inválida');
        return {
          success: false,
          message: 'Erro no cadastro: resposta inválida do servidor'
        };
      }
    } catch (error) {
      console.error('❌ Erro no registro:', error);

      // Tratamento de erros específicos
      let errorMessage = 'Erro ao cadastrar';

      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Dados inválidos';
        } else if (error.response.status === 409) {
          errorMessage = 'Email já está em uso';
        } else if (error.response.status === 500) {
          errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
        } else {
          errorMessage = error.response.data?.message || `Erro ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = 'Sem resposta do servidor. Verifique sua conexão.';
      } else {
        errorMessage = error.message || 'Erro desconhecido';
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

/*
// --- DADOS REAIS DO BACKEND ---
export const getCostureiros = async () => {
  try {
    const response = await api.get('/costureiros'); 
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar costureiros (API):", error);
    // Retorna a lista estática como FALLBACK se a API falhar
    return DADOS_DOS_COSTUREIROS; 
  }
};

export const getEmpresas = async () => {
  try {
    return []; 
  } catch (error) {
    return [];
  }
};
*/


// 3. TODAS as funções continuam com 'export' para não dar erro.
export const getEmpresas = () => { return DADOS_DAS_EMPRESAS; };


// 4. A função getAllItems agora retorna APENAS os costureiros.
export const getAllItems = () => { return DADOS_DOS_COSTUREIROS; };

export const getEmpresaById = (id) => { return DADOS_DAS_EMPRESAS.find(e => e.id === parseInt(id)); };



export const getCostureiros = async () => {
  try {
    const response = await api.get('/couturiers');
    return response.data; // array de CouturierDTO
  } catch (error) {
    console.error('Erro ao buscar costureiros:', error);
    return []; // retorna array vazio em caso de erro
  }
};

// Função para buscar costureiros em destaque (top rated)
export const getCostureirosDestaque = async (limit = 5) => {
  try {
    const response = await api.get(`/couturiers/top-rated?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar destaques:', error);
    return [];
  }
};

// Função para buscar costureiro por ID
export const getCostureiroById = async (id) => {
  try {
    const response = await api.get(`/couturiers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar costureiro:', error);
    return null;
  }
};

export const unlockProfile = async (couturierId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'EMPRESA') {
      throw new Error('Usuário não é empresa');
    }
    const response = await api.post(`/enterprises/${user.id}/coins/unlock`, {
      couturierId: couturierId
    });
    return response.data; // 200 OK (vazio)
  } catch (error) {
    console.error('Erro ao desbloquear perfil:', error);
    // Se a API retornar mensagem de erro, extrai
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
};

// Buscar imagem de perfil por ID do usuário
export const getUserProfileImageById = async (userId) => {
  try {
    const response = await api.get(`/images/profile/${userId}`, {
      responseType: 'blob', // MUITO IMPORTANTE
    });

    // Converte blob para URL temporária
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error('Erro ao buscar imagem de perfil:', error);
    return null;
  }
};
export const fetchUserBalance = async (userId) => {
  try {
    const response = await api.get(`/enterprises/${userId}/coins/balance`);
    return response.data; // Retorna o saldo para o front-end usar
  } catch (error) {
    console.error('Erro ao buscar saldo:', error);
    return null;
  }
};
// ==========================================
// -- FUNÇÃO PARA PAGAMENTO PIX ATUALIZADA --
// ==========================================
export const gerarPagamentoPix = async (dadosPagamento) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || user.role !== 'EMPRESA') {
      throw new Error('Apenas empresas podem gerar pagamentos.');
    }

    const response = await api.post('/pagamentos/pix', {
      empresaId: user.id,
      planoId: dadosPagamento.planoId,
      valor: dadosPagamento.valor
    });

    return {
      success: true,
      pixData: response.data
    };

  } catch (error) {
    console.error('Erro ao gerar PIX:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao comunicar com o servidor para gerar o PIX.'
    };
  }
};

// ==========================================
// -- FUNÇÃO PARA CARTÃO E BOLETO --
// ==========================================
export const processarPagamento = async (payload) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));

    // A rota '/pagamentos/processar' deve existir no seu Controller Java
    const response = await api.post('/pagamentos/processar', payload);

    return {
      success: true,
      data: response.data
    };

  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao comunicar com o servidor financeiro.'
    };
  }
};

// --- DADOS ESTÁTICOS (MANTIDOS PARA NÃO QUEBRAR OUTRAS PÁGINAS) ---
// Se você remover isso, páginas que importam { DADOS_DOS_COSTUREIROS } vão quebrar.
export const DADOS_DOS_COSTUREIROS = [
  {
    id: 101,
    nome: 'Gabriel Batista',
    categoria: 'Modinha e Moda Praia',
    contato: '(81) 94589-****',
    endereco: 'Rua Governador, 123, Centro, Caruaru',
    imageUrl: 'https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    foto_url: 'https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isDestaque: true,
    avaliacao: 5,
    tipo: 'costureiros',
    cidade: 'Caruaru - PE',
    tags: ["Moda Praia", "Atacado"]
  },
  {
    id: 102,
    nome: 'Sara Gabriely',
    categoria: 'Modinha',
    contato: '(81) 94589-****',
    endereco: 'Av. Principal, 456, Centro, Toritama',
    imageUrl: 'https://images.pexels.com/photos/3772510/pexels-photo-3772510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    foto_url: 'https://images.pexels.com/photos/3772510/pexels-photo-3772510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isDestaque: true,
    avaliacao: 4,
    tipo: 'costureiros',
    cidade: 'Toritama - PE',
    tags: ["Modinha", "Varejo"]
  },
];


export default api;