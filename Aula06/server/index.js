// SERVIDOR DA AULA 6 — server/index.js
//
// Uma API HTTP mínima, em Express, com os dados em memória (ver banco.js).
//
//   node index.js            -> http://localhost:3000
//   ATRASO=0 node index.js   -> sem o atraso artificial das respostas
//
// Rotas:
//   POST /auth/cadastro   { nome, email, senha }  -> 201 { token, usuario }
//   POST /auth/login      { email, senha }        -> 200 { token, usuario }
//   GET  /auth/me         (token)                 -> 200 usuario
//   POST /auth/logout     (token)                 -> 204
//   GET  /anotacoes       (token)                 -> 200 [anotacao]
//   POST /anotacoes       (token) { texto }       -> 201 anotacao
//   GET  /usuarios        (token de admin)        -> 200 [usuario]
//
// "(token)" = a requisição precisa do cabeçalho  Authorization: Bearer <token>

import cors from 'cors';
import express from 'express';
import os from 'node:os';

import * as banco from './banco.js';

const PORTA = Number(process.env.PORT ?? 3000);
// Atraso artificial (ms) para os estados de "carregando" do app ficarem
// visíveis em aula. Em uma API real a latência vem da rede.
const ATRASO_MS = Number(process.env.ATRASO ?? 400);

const app = express();

// CORS: o app rodando no navegador (localhost:8081) chama esta API em outra
// porta (3000). Sem este cabeçalho o navegador bloqueia a resposta.
app.use(cors());

// Log de cada requisição no terminal — deixe o terminal visível durante a
// aula para acompanhar o que o app está pedindo.
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`${req.method} ${req.path} -> ${res.statusCode}`);
  });
  setTimeout(next, ATRASO_MS);
});

// Converte o corpo JSON das requisições em req.body.
app.use(express.json());

// ------------------------------------------------------------ middlewares

// Lê o token do cabeçalho Authorization e descobre quem está pedindo.
// Sem token válido a requisição para aqui, com 401 (não autenticado).
function autenticado(req, res, next) {
  const [tipo, token] = (req.headers.authorization ?? '').split(' ');
  const usuario = tipo === 'Bearer' && token ? banco.usuarioDaSessao(token) : null;

  if (!usuario) {
    return res.status(401).json({ mensagem: 'Faça login para continuar.' });
  }

  req.usuario = usuario;
  req.token = token;
  next();
}

// 403 (proibido) é diferente de 401: o servidor sabe quem é, mas essa
// pessoa não pode fazer isso.
function somenteAdmin(req, res, next) {
  if (req.usuario.papel !== 'admin') {
    return res.status(403).json({ mensagem: 'Somente administradores podem acessar isto.' });
  }
  next();
}

// ------------------------------------------------------------------ rotas

app.get('/', (req, res) => {
  res.json({
    mensagem: 'Servidor da Aula 6 no ar.',
    contasDeTeste: banco.CONTAS_DE_TESTE,
    rotas: [
      'POST /auth/cadastro',
      'POST /auth/login',
      'GET  /auth/me',
      'POST /auth/logout',
      'GET  /anotacoes',
      'POST /anotacoes',
      'GET  /usuarios (admin)',
    ],
  });
});

app.post('/auth/cadastro', (req, res) => {
  const { nome, email, senha } = req.body ?? {};

  if (!nome?.trim() || !email?.trim() || !senha) {
    return res.status(400).json({ mensagem: 'Informe nome, e-mail e senha.' });
  }
  if (!email.includes('@')) {
    return res.status(400).json({ mensagem: 'E-mail inválido.' });
  }
  if (senha.length < 6) {
    return res.status(400).json({ mensagem: 'A senha precisa ter pelo menos 6 caracteres.' });
  }
  if (banco.buscarUsuarioPorEmail(email)) {
    // 409 (conflito): o recurso que se tentou criar já existe.
    return res.status(409).json({ mensagem: 'Já existe uma conta com esse e-mail.' });
  }

  const usuario = banco.criarUsuario({ nome, email, senha });
  // Cadastrou, já entra: o app não precisa pedir login em seguida.
  const token = banco.criarSessao(usuario.id);
  res.status(201).json({ token, usuario });
});

app.post('/auth/login', (req, res) => {
  const { email, senha } = req.body ?? {};

  if (!email?.trim() || !senha) {
    return res.status(400).json({ mensagem: 'Informe e-mail e senha.' });
  }

  const usuario = banco.autenticar(email, senha);
  if (!usuario) {
    // A mesma mensagem para "e-mail não existe" e "senha errada": não
    // contar a quem tenta adivinhar quais e-mails estão cadastrados.
    return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
  }

  const token = banco.criarSessao(usuario.id);
  res.json({ token, usuario });
});

// Quem sou eu? Serve para o app confirmar que o token ainda vale.
app.get('/auth/me', autenticado, (req, res) => {
  res.json(req.usuario);
});

app.post('/auth/logout', autenticado, (req, res) => {
  banco.encerrarSessao(req.token);
  res.status(204).end();
});

// Cada usuário só enxerga as próprias anotações: o filtro usa o id que veio
// do token, não algo que o cliente mandou.
app.get('/anotacoes', autenticado, (req, res) => {
  res.json(banco.listarAnotacoes(req.usuario.id));
});

app.post('/anotacoes', autenticado, (req, res) => {
  const { texto } = req.body ?? {};
  if (!texto?.trim()) {
    return res.status(400).json({ mensagem: 'A anotação não pode ficar vazia.' });
  }
  res.status(201).json(banco.criarAnotacao(req.usuario.id, texto));
});

app.get('/usuarios', autenticado, somenteAdmin, (req, res) => {
  res.json(banco.listarUsuarios());
});

// Qualquer outro caminho.
app.use((req, res) => {
  res.status(404).json({ mensagem: `Rota não encontrada: ${req.method} ${req.path}` });
});

// Erros inesperados (JSON malformado, exceção em uma rota...): responder em
// JSON também, para o app conseguir ler a mensagem. Os quatro parâmetros
// são o que diz ao Express que este middleware trata erros.
app.use((erro, req, res, next) => {
  const status = erro.status ?? 500;
  if (status === 500) console.error(erro);
  res.status(status).json({
    mensagem: status === 400 ? 'Corpo da requisição inválido.' : 'Erro interno no servidor.',
  });
});

// ---------------------------------------------------------------- início

// 0.0.0.0 = aceitar conexões de outros aparelhos na mesma rede (o celular
// com o Expo Go, por exemplo), não só deste computador.
app.listen(PORTA, '0.0.0.0', () => {
  console.log(`Servidor da Aula 6 ouvindo na porta ${PORTA}`);
  console.log(`  local:  http://localhost:${PORTA}`);
  for (const interfaces of Object.values(os.networkInterfaces())) {
    for (const rede of interfaces ?? []) {
      if (rede.family === 'IPv4' && !rede.internal) {
        console.log(`  rede:   http://${rede.address}:${PORTA}`);
      }
    }
  }
  console.log('\nContas de teste:');
  for (const conta of banco.CONTAS_DE_TESTE) {
    console.log(`  ${conta.email} / ${conta.senha}  (${conta.papel})`);
  }
  console.log('');
});
