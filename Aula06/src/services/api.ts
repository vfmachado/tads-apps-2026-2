import Constants from 'expo-constants';

import type { Anotacao, Sessao, Usuario, UsuarioResumo } from '@/models/usuario';

// SERVIÇO DE API — src/services/api.ts
//
// Único lugar do app que conhece o servidor: URL, cabeçalhos, formato do
// erro. As telas e o contexto chamam `api.login(...)`, `api.listarAnotacoes(...)`
// e não sabem que existe `fetch` por baixo.
//
// (Consumo de APIs é assunto da Aula 10. Aqui só o necessário para o login.)

// ONDE ESTÁ O SERVIDOR?
//
// `localhost` só funciona no navegador e no simulador iOS. No emulador
// Android e no celular físico, "localhost" é o próprio aparelho. Por isso
// usamos o IP do computador em que o Expo está rodando — o mesmo computador
// onde `node server/index.js` está de pé. O Expo informa esse IP em
// Constants.expoConfig.hostUri ("192.168.0.10:8081").
//
// Para apontar para outro lugar: EXPO_PUBLIC_API_URL=http://... npx expo start
const hostDoExpo = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? `http://${hostDoExpo}:3000`;

// Erro com o status HTTP: a tela pode distinguir "senha errada" (401) de
// "servidor fora do ar" (0) sem olhar o texto da mensagem.
export class ApiError extends Error {
  constructor(
    public status: number,
    mensagem: string,
  ) {
    super(mensagem);
    this.name = 'ApiError';
  }
}

interface Opcoes {
  metodo?: 'GET' | 'POST';
  corpo?: unknown;
  // Quando existe, vai no cabeçalho Authorization. É assim que o servidor
  // descobre quem está pedindo.
  token?: string | null;
}

async function requisicao<T>(caminho: string, { metodo = 'GET', corpo, token }: Opcoes = {}) {
  let resposta: Response;

  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
  } catch {
    // fetch só rejeita quando NEM CHEGOU a falar com o servidor.
    throw new ApiError(0, `Não foi possível conectar em ${API_URL}. O servidor está rodando?`);
  }

  // 204 = sucesso sem corpo (o logout responde assim).
  if (resposta.status === 204) return undefined as T;

  const dados = await resposta.json().catch(() => null);

  // 4xx e 5xx NÃO rejeitam o fetch: quem decide que é erro somos nós.
  if (!resposta.ok) {
    throw new ApiError(resposta.status, dados?.mensagem ?? `Erro ${resposta.status}`);
  }

  return dados as T;
}

export const api = {
  login: (email: string, senha: string) =>
    requisicao<Sessao>('/auth/login', { metodo: 'POST', corpo: { email, senha } }),

  cadastrar: (nome: string, email: string, senha: string) =>
    requisicao<Sessao>('/auth/cadastro', { metodo: 'POST', corpo: { nome, email, senha } }),

  sair: (token: string) => requisicao<void>('/auth/logout', { metodo: 'POST', token }),

  perfil: (token: string | null) => requisicao<Usuario>('/auth/me', { token }),

  listarAnotacoes: (token: string | null) => requisicao<Anotacao[]>('/anotacoes', { token }),

  criarAnotacao: (token: string | null, texto: string) =>
    requisicao<Anotacao>('/anotacoes', { metodo: 'POST', corpo: { texto }, token }),

  listarUsuarios: (token: string | null) => requisicao<UsuarioResumo[]>('/usuarios', { token }),
};
