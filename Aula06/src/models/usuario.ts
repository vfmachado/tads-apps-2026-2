// Tipos dos dados que o servidor devolve (ver server/index.js).

export type Papel = 'admin' | 'usuario';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: Papel;
  criadoEm: string;
}

// O que o servidor devolve no login e no cadastro: o token que identifica a
// sessão e os dados de quem entrou. É isto que o AuthContext guarda.
export interface Sessao {
  token: string;
  usuario: Usuario;
}

export interface Anotacao {
  id: string;
  texto: string;
  criadaEm: string;
}

// Só a tela de administração recebe isto (GET /usuarios).
export interface UsuarioResumo extends Usuario {
  totalAnotacoes: number;
}
