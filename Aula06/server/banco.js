// "BANCO DE DADOS" EM MEMÓRIA — server/banco.js
//
// Três Maps fazem o papel de três tabelas. Tudo vive na memória do processo:
// reiniciar o servidor apaga os cadastros feitos em aula e invalida todos os
// tokens. Isso é proposital — o objetivo da aula é o fluxo de autenticação
// no app, não a persistência.
//
// Em um projeto real, este arquivo seria substituído por um banco de verdade
// (SQLite, Postgres...). A interface exportada continuaria a mesma.

import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';

const usuarios = new Map(); // id     -> { id, nome, email, papel, senhaHash, salt, criadoEm }
const sessoes = new Map(); // token  -> usuarioId
const anotacoes = new Map(); // id     -> { id, usuarioId, texto, criadaEm }

// ---------------------------------------------------------------- senhas

// Nunca guardamos a senha em si — guardamos um hash com "sal". Mesmo em um
// servidor de aula, vale praticar o hábito: quem lê a memória do processo
// não descobre a senha de ninguém.
function gerarHash(senha, salt = randomBytes(16).toString('hex')) {
  const hash = scryptSync(senha, salt, 64).toString('hex');
  return { salt, hash };
}

function senhaConfere(usuario, senha) {
  const { hash } = gerarHash(senha, usuario.salt);
  // timingSafeEqual evita que o tempo da comparação vaze informação.
  return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(usuario.senhaHash, 'hex'));
}

// O que sai para o cliente: sem hash e sem sal.
function publico(usuario) {
  const { senhaHash, salt, ...resto } = usuario;
  return resto;
}

// --------------------------------------------------------------- usuários

export function buscarUsuarioPorEmail(email) {
  const alvo = email.trim().toLowerCase();
  for (const usuario of usuarios.values()) {
    if (usuario.email === alvo) return usuario;
  }
  return null;
}

export function criarUsuario({ nome, email, senha, papel = 'usuario' }) {
  const { salt, hash } = gerarHash(senha);
  const usuario = {
    id: randomUUID(),
    nome: nome.trim(),
    email: email.trim().toLowerCase(),
    papel,
    senhaHash: hash,
    salt,
    criadoEm: new Date().toISOString(),
  };
  usuarios.set(usuario.id, usuario);
  return publico(usuario);
}

// Devolve o usuário (sem senha) se e-mail e senha conferem; senão, null.
export function autenticar(email, senha) {
  const usuario = buscarUsuarioPorEmail(email);
  if (!usuario || !senhaConfere(usuario, senha)) return null;
  return publico(usuario);
}

// Só para a tela de administração: todos os usuários com a contagem de
// anotações de cada um.
export function listarUsuarios() {
  return [...usuarios.values()].map((usuario) => ({
    ...publico(usuario),
    totalAnotacoes: listarAnotacoes(usuario.id).length,
  }));
}

// ---------------------------------------------------------------- sessões

// O token é um identificador opaco: uma string aleatória que o servidor
// associa a um usuário. O cliente não consegue ler nada dentro dele — só
// devolvê-lo em cada requisição. (JWT é a alternativa comum: um token que
// carrega os dados assinados; a ideia de "mandar em todo pedido" é a mesma.)
export function criarSessao(usuarioId) {
  const token = randomUUID();
  sessoes.set(token, usuarioId);
  return token;
}

export function usuarioDaSessao(token) {
  const usuarioId = sessoes.get(token);
  if (!usuarioId) return null;
  const usuario = usuarios.get(usuarioId);
  return usuario ? publico(usuario) : null;
}

export function encerrarSessao(token) {
  return sessoes.delete(token);
}

// -------------------------------------------------------------- anotações

export function listarAnotacoes(usuarioId) {
  return [...anotacoes.values()]
    .filter((anotacao) => anotacao.usuarioId === usuarioId)
    .sort((a, b) => b.criadaEm.localeCompare(a.criadaEm));
}

export function criarAnotacao(usuarioId, texto) {
  const anotacao = {
    id: randomUUID(),
    usuarioId,
    texto: texto.trim(),
    criadaEm: new Date().toISOString(),
  };
  anotacoes.set(anotacao.id, anotacao);
  return anotacao;
}

// ------------------------------------------------------- dados iniciais

// Duas contas prontas para a aula. A senha está aqui em texto só porque é
// um dado de exemplo — o Map guarda apenas o hash.
export const CONTAS_DE_TESTE = [
  { nome: 'Administrador', email: 'admin@ifrs.edu.br', senha: 'admin123', papel: 'admin' },
  { nome: 'Ana', email: 'ana@ifrs.edu.br', senha: '123456', papel: 'usuario' },
];

for (const conta of CONTAS_DE_TESTE) {
  const usuario = criarUsuario(conta);
  if (conta.papel === 'usuario') {
    criarAnotacao(usuario.id, 'Revisar o material da Aula 5 (navegação).');
    criarAnotacao(usuario.id, 'Trazer o carregador para a aula de quinta.');
  }
}
