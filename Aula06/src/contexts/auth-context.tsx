import { createContext, useContext, useState, type ReactNode } from 'react';

import type { Sessao, Usuario } from '@/models/usuario';
import { api } from '@/services/api';

// CONTEXTO DE AUTENTICAÇÃO — src/contexts/auth-context.tsx
//
// O problema: quem está logado interessa a MUITAS telas (o cabeçalho mostra
// o nome, o layout decide quais rotas existem, a lista busca dados com o
// token). Passar isso por props, tela a tela, não escala — e o layout raiz
// nem tem como passar props para as telas do Expo Router.
//
// A solução da Context API tem três peças:
//
//   1. createContext()  — cria o "canal";
//   2. <AuthProvider>   — o componente que GUARDA o estado e o coloca no canal,
//                         envolvendo a parte da árvore que precisa dele;
//   3. useAuth()        — o hook que qualquer componente abaixo do provider
//                         usa para LER o canal.
//
// Quando o valor do provider muda (alguém entrou ou saiu), todos os
// componentes que chamaram useAuth() são re-renderizados — como se o estado
// fosse deles.

// O que fica disponível para quem chamar useAuth().
interface AuthContextValue {
  // null = ninguém logado. É este valor que os layouts consultam para
  // decidir quais rotas estão acessíveis.
  usuario: Usuario | null;
  // O token vai no cabeçalho de toda requisição autenticada.
  token: string | null;
  entrar: (email: string, senha: string) => Promise<void>;
  cadastrar: (nome: string, email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
}

// 1. O canal. O valor inicial (null) só é visto por quem chamar useAuth()
// FORA de um provider — e o hook trata isso como erro de programação.
const AuthContext = createContext<AuthContextValue | null>(null);

// 2. O provider: um componente comum, com useState comum. A única diferença
// para qualquer outro componente é que ele entrega o estado via contexto,
// e não via props.
export function AuthProvider({ children }: { children: ReactNode }) {
  // Token e usuário mudam sempre juntos, então vivem em um único estado.
  const [sessao, setSessao] = useState<Sessao | null>(null);

  async function entrar(email: string, senha: string) {
    // Se o servidor recusar, api.login lança um erro — e ele sobe até a tela
    // de login, que é quem sabe mostrar a mensagem. O provider não trata.
    const novaSessao = await api.login(email, senha);
    setSessao(novaSessao);
    // Repare: NENHUMA navegação aqui. Mudar o estado basta — o layout raiz
    // lê `usuario` e troca as rotas disponíveis sozinho.
  }

  async function cadastrar(nome: string, email: string, senha: string) {
    // O servidor já devolve a sessão no cadastro: quem se cadastra entra.
    const novaSessao = await api.cadastrar(nome, email, senha);
    setSessao(novaSessao);
  }

  async function sair() {
    // Avisa o servidor para invalidar o token, mas o logout local acontece
    // de qualquer jeito — mesmo com o servidor fora do ar.
    if (sessao) {
      await api.sair(sessao.token).catch(() => {});
    }
    setSessao(null);
  }

  // No React 19 o próprio contexto é o provider. Antes se escrevia
  // <AuthContext.Provider value={...}> — as duas formas funcionam.
  return (
    <AuthContext
      value={{
        usuario: sessao?.usuario ?? null,
        token: sessao?.token ?? null,
        entrar,
        cadastrar,
        sair,
      }}>
      {children}
    </AuthContext>
  );
}

// 3. O hook. Encapsula o useContext e falha cedo, com uma mensagem clara,
// se alguém esquecer o provider — em vez de um "cannot read property
// 'usuario' of null" em uma tela qualquer.
export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);
  if (contexto === null) {
    throw new Error('useAuth() só pode ser usado dentro de <AuthProvider>.');
  }
  return contexto;
}
