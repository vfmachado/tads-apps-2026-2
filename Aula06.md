## Aula 6 — Autenticação e estado global: Context API, login e rotas protegidas

**Objetivos**

* Entender o problema que a Context API resolve: um estado que muitas telas
  precisam ler, sem passar props tela a tela.
* Montar as três peças do padrão: `createContext`, o *provider* e o *hook*.
* Implementar cadastro, login e logout contra uma API real, com token.
* Fazer os layouts do Expo Router lerem o contexto e decidirem quais rotas
  existem (`Stack.Protected`).
* Separar o que é responsabilidade do app (interface) e do servidor
  (autorização de verdade).

**Conteúdo**

* Estado local × estado global; o problema do *prop drilling*.
* `createContext`, `<Contexto value>`, `useContext`; custom hook `useAuth`.
* Provider no layout raiz; por que o leitor precisa estar *dentro* do provider.
* Fluxo de autenticação: cadastro, login, token, logout.
* Serviço de API: `fetch`, cabeçalho `Authorization: Bearer`, erros com status.
* `Stack.Protected` com `guard`; grupos `(auth)` e `(app)`; guard por papel.
* Servidor Node.js (Express) com dados em memória: hash de senha, sessões,
  `401` × `403`.

**Explicação**

### O problema

Depois do login, *quem está logado* interessa a lugares muito diferentes do
app:

* o layout raiz precisa decidir: mostra o login ou mostra o app?
* o layout do app precisa saber se a pessoa é admin;
* a tela inicial mostra o nome;
* a tela de anotações manda o token em cada requisição;
* o botão "Sair" precisa limpar tudo isso.

Com o que temos até aqui — `useState` (Aula 4) e props (Aula 2) — a única
saída seria guardar o estado no componente mais externo e passar por props
até chegar em quem usa. Isso é o *prop drilling*: componentes do meio
recebendo props que não usam, só para repassar. E no Expo Router nem isso é
possível: **o layout não passa props para as telas**. As telas são arquivos
que o roteador monta sozinho.

Precisamos de um jeito de um componente *publicar* um valor e qualquer
descendente *ler* esse valor, sem passar por quem está no meio.

### Context API: três peças

```tsx
// src/contexts/auth-context.tsx

// 1. O canal
const AuthContext = createContext<AuthContextValue | null>(null);

// 2. O provider: guarda o estado e o coloca no canal
export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Sessao | null>(null);

  async function entrar(email: string, senha: string) {
    setSessao(await api.login(email, senha));
  }
  async function sair() {
    if (sessao) await api.sair(sessao.token).catch(() => {});
    setSessao(null);
  }

  return (
    <AuthContext value={{ usuario: sessao?.usuario ?? null, token: sessao?.token ?? null, entrar, cadastrar, sair }}>
      {children}
    </AuthContext>
  );
}

// 3. O hook: lê o canal
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (contexto === null) throw new Error('useAuth() só pode ser usado dentro de <AuthProvider>.');
  return contexto;
}
```

Três observações:

**O provider é um componente comum.** Ele usa `useState` como qualquer outro.
A única diferença é *para onde* o estado vai: em vez de virar prop, ele vira o
`value` do contexto. Tudo que estiver dentro de `{children}` consegue ler.

**Quando o `value` muda, quem leu re-renderiza.** Chamar `useAuth()` é
"assinar" o contexto. Se `sessao` mudar no provider, todo componente que
chamou `useAuth()` renderiza de novo — como se o estado fosse dele. O
componente `SessaoAtual` do projeto está em três telas justamente para
mostrar isso acontecendo.

**O hook protege contra o erro mais comum.** Esquecer o provider não dá erro
de compilação; dá `usuario` undefined em alguma tela distante. O `throw` no
`useAuth()` transforma isso em uma mensagem clara, no lugar certo.

> No React 19 o próprio contexto funciona como provider:
> `<AuthContext value={...}>`. Em código mais antigo (e em muitos tutoriais)
> a forma é `<AuthContext.Provider value={...}>`. As duas funcionam.

### Onde fica o provider

No layout raiz, envolvendo tudo:

```tsx
// src/app/_layout.tsx
export default function RootLayout() {
  return (
    <AuthProvider>
      <RotasDoApp />
    </AuthProvider>
  );
}
```

Por que `RotasDoApp` é um componente separado? Porque **quem lê o contexto
precisa estar dentro do provider**. Se `RootLayout` chamasse `useAuth()` e
renderizasse o `<AuthProvider>` na mesma função, estaria lendo o canal antes
de criá-lo — e cairia no `throw` do hook. É a armadilha número um da Context
API.

### O fluxo de autenticação

O servidor (`server/`) tem quatro rotas de autenticação:

| Rota | Recebe | Devolve |
|------|--------|---------|
| `POST /auth/cadastro` | `{ nome, email, senha }` | `{ token, usuario }` |
| `POST /auth/login` | `{ email, senha }` | `{ token, usuario }` |
| `GET /auth/me` | token | `usuario` |
| `POST /auth/logout` | token | nada (`204`) |

O **token** é uma string aleatória que o servidor associa ao usuário. O app não
lê nada dentro dele; só o guarda e o devolve em cada requisição, no cabeçalho:

```
Authorization: Bearer 5ed7c64c-a15a-4461-bab2-061fadc85787
```

Quem coloca o cabeçalho é `src/services/api.ts` — o único arquivo que sabe que
existe `fetch`. As telas e o contexto chamam `api.login(...)`,
`api.listarAnotacoes(token)` e recebem objetos ou um erro com o status:

```ts
const dados = await resposta.json().catch(() => null);
if (!resposta.ok) throw new ApiError(resposta.status, dados?.mensagem ?? `Erro ${resposta.status}`);
```

`fetch` **não rejeita** em `401` ou `500` — só quando nem chegou a conectar.
Quem decide que `401` é erro somos nós. (Consumo de APIs é assunto das Aulas
10 e 11; aqui está o mínimo.)

### Quem trata o erro

O provider **não** trata o erro do login. Se `api.login` lançar, `entrar()`
lança também — e o erro sobe até a tela, que é quem sabe mostrá-lo:

```tsx
// src/app/(auth)/login.tsx
async function handleEntrar() {
  setErro(null);
  setEnviando(true);
  try {
    await entrar(email, senha);
  } catch (e) {
    setErro(e instanceof Error ? e.message : 'Não foi possível entrar.');
  } finally {
    setEnviando(false);
  }
}
```

Repare na divisão: **a sessão é do contexto; o formulário é da tela.** Campos,
mensagem de erro e o estado "enviando" são `useState` locais. Só o resultado
do login vai para o contexto.

### Rotas que dependem do usuário

Aqui entra a peça nova do Expo Router. O layout raiz é o **primeiro leitor**
do contexto:

```tsx
function RotasDoApp() {
  const { usuario } = useAuth();
  const logado = usuario !== null;

  return (
    <Stack>
      <Stack.Protected guard={!logado}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={logado}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
```

`<Stack.Protected guard={false}>` **remove as rotas filhas do navegador**.
Não é "esconder": para o roteador, elas não existem. Duas consequências:

1. Não se chega nelas por `Link`, `router.push` nem link externo. O Expo
   Router leva para a primeira rota disponível.
2. Se o usuário está em uma delas quando o guard vira `false`, ele é levado
   embora imediatamente.

Junte isso ao contexto e o login vira uma linha:

```
tela chama entrar()  →  provider faz setSessao()  →  layout re-renderiza
→  guard de (auth) vira false, guard de (app) vira true  →  o app está na tela inicial
```

**Nenhuma tela chama `router.replace()` depois do login ou do logout.** A
navegação é consequência do estado. Compare com a alternativa manual, que
aparece em tutoriais mais antigos:

```tsx
// jeito manual (não usado no projeto)
const segments = useSegments();
useEffect(() => {
  const emAuth = segments[0] === '(auth)';
  if (!usuario && !emAuth) router.replace('/login');
  if (usuario && emAuth) router.replace('/');
}, [usuario, segments]);
```

Funciona, mas é um efeito que corre *depois* de renderizar a tela errada, e
precisa ser mantido em sincronia com a estrutura de pastas. `Stack.Protected`
faz a mesma coisa declarativamente, no lugar onde as rotas são definidas.

### A segunda pergunta: quem é?

"Está logado?" não é a única pergunta. Dentro do grupo logado:

```tsx
// src/app/(app)/_layout.tsx
const { usuario } = useAuth();

<Stack.Protected guard={usuario?.papel === 'admin'}>
  <Stack.Screen name="admin" options={{ title: 'Administração' }} />
</Stack.Protected>
```

Para a Ana, `/admin` não existe — `router.push('/admin')` a devolve ao início.
Para o Administrador, existe. A tela inicial lê o **mesmo** `usuario` para
decidir se mostra o link no menu: o menu decide o que *mostrar*; o layout
decide o que *existe*.

### O que o app protege e o que o servidor protege

`Stack.Protected` é proteção de **interface**. Qualquer pessoa com o código do
app pode tirar o guard. A autorização de verdade está no servidor, que
confere em toda requisição:

```js
// server/index.js
function autenticado(req, res, next) {
  const [tipo, token] = (req.headers.authorization ?? '').split(' ');
  const usuario = tipo === 'Bearer' && token ? banco.usuarioDaSessao(token) : null;
  if (!usuario) return res.status(401).json({ mensagem: 'Faça login para continuar.' });
  req.usuario = usuario;
  next();
}

function somenteAdmin(req, res, next) {
  if (req.usuario.papel !== 'admin') return res.status(403).json({ mensagem: 'Somente administradores podem acessar isto.' });
  next();
}

app.get('/usuarios', autenticado, somenteAdmin, (req, res) => { ... });
```

Dois códigos que os alunos confundem:

| Status | Significa | No projeto |
|--------|-----------|------------|
| `401` | não sei quem você é | sem token, token inválido, senha errada |
| `403` | sei quem você é, e você não pode | Ana pedindo `GET /usuarios` |

E o filtro das anotações usa o id **que veio do token** — não um id que o
cliente mandou. Cada usuário só vê as próprias, não importa o que o app peça.

### O servidor em memória

`server/banco.js` são três `Map`: usuários, sessões (token → id) e anotações.
Reiniciar o processo apaga tudo, menos as duas contas de teste, recriadas ao
subir. Isso é proposital: a aula é sobre o fluxo no app, não sobre
persistência — e reiniciar o servidor com o app logado é um experimento
valioso (ver *Para observar em aula*).

Mesmo assim, a senha nunca é guardada: guarda-se um *hash* com sal
(`scryptSync`). É hábito, não burocracia.

### Onde está o servidor?

`localhost` só existe no navegador e no simulador iOS. No emulador Android e
no celular, "localhost" é o próprio aparelho. Por isso `api.ts` usa o IP do
computador em que o Expo está rodando — o Expo o informa em
`Constants.expoConfig.hostUri`:

```ts
const hostDoExpo = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? `http://${hostDoExpo}:3000`;
```

O celular precisa estar na mesma rede Wi-Fi que o computador. A tela de login
mostra a URL em uso.

### Três armadilhas

**1. Ler o contexto fora do provider.** O sintoma é o `throw` do `useAuth()`.
A causa quase sempre é o componente que renderiza o `<AuthProvider>` tentando
usar `useAuth()` na mesma função.

**2. Navegar depois do login.** `router.replace('/')` dentro de `entrar()` ou
depois dele funciona hoje e quebra amanhã: quando o guard trocar as rotas, a
navegação manual disputa com o roteador. Deixe o estado navegar.

**3. Achar que o app protege alguma coisa.** Esconder a rota `/admin` não
impede ninguém de chamar `GET /usuarios`. Toda regra que importa tem de estar
no servidor; a do app é só para a interface não mostrar o que não se pode
usar.

### Comparação

| | `useState` na tela | Context API |
|---|---|---|
| Quem enxerga | a tela e quem recebe por props | qualquer descendente do provider |
| Quando usar | formulário, abrir/fechar, seleção | usuário logado, tema, idioma, carrinho |
| Custo | nenhum | todo leitor re-renderiza quando o valor muda |

Context não substitui `useState`: o formulário de login continua com estado
local. O contexto é para o que é **compartilhado**.

**Prática**

Projeto: `Aula06/` — dois terminais.

```
cd Aula06/server && npm install && npm start      # API em http://localhost:3000
cd Aula06 && npm install && npx expo start        # app
```

Contas de teste: `ana@ifrs.edu.br` / `123456` (usuária) e
`admin@ifrs.edu.br` / `admin123` (admin).

Arquivos:

* `src/contexts/auth-context.tsx` — `AuthProvider` e `useAuth`
* `src/services/api.ts` — `fetch`, token no cabeçalho, `ApiError`
* `src/app/_layout.tsx` — provider + `Stack.Protected` logado / não logado
* `src/app/(auth)/login.tsx`, `cadastro.tsx` — formulários; erro tratado na tela
* `src/app/(app)/_layout.tsx` — `Stack.Protected` por papel
* `src/app/(app)/index.tsx` — nome do contexto; link de admin condicional
* `src/app/(app)/anotacoes.tsx` — requisições autenticadas
* `src/app/(app)/perfil.tsx` — dados da sessão, `GET /auth/me`, sair
* `src/app/(app)/admin.tsx` — só para admin
* `server/index.js`, `server/banco.js` — API e dados em memória

Componentes novos: `SessaoAtual` (mostra o contexto ao vivo), `Campo`,
`MensagemErro`, `AnotacaoItem`, `UsuarioItem`.

Exercícios:

1. Trate o `401` nas telas de anotações e admin: se o servidor responder "não
   autenticado", chame `sair()` para o app voltar ao login sozinho.
2. Adicione `carregando` ao contexto e mostre uma tela de espera durante o
   login, em vez de só desabilitar o botão.
3. Crie `/anotacoes/[id]` com os detalhes de uma anotação. Ela precisa ficar
   dentro de `(app)` — por quê?
4. Crie o papel `moderador` no servidor e uma rota que só ele e o admin
   acessem. Liste os lugares que precisaram mudar.
5. Guarde o token com `AsyncStorage` para a sessão sobreviver ao reload
   (assunto da aula de persistência — vale tentar antes).
6. O `AuthProvider` recria `entrar`, `cadastrar` e `sair` a cada render. Isso é
   um problema neste projeto? (Dica: `reactCompiler` em `app.json`.)

**Para observar em aula**

* Subir o servidor e abrir `http://localhost:3000` no navegador: a lista de
  rotas e as contas de teste.
* Abrir o app na web (`w`) com o terminal do servidor visível. No login, o
  `SessaoAtual` mostra `usuario null` — o contexto existe, só está vazio.
* Errar a senha: a mensagem veio do servidor; no terminal, `401`.
* Entrar como Ana e perguntar: **quem navegou?** Mostrar que não há
  `router.push` no login nem no provider — só o `guard`.
* Início: tocar em *Tentar abrir /admin mesmo assim*. Nada acontece. Abrir
  `(app)/_layout.tsx` e mostrar o guard por papel.
* Anotações: cada toque é um `GET` ou `POST` no terminal, sempre com o mesmo
  token. Entrar depois como admin: outra lista (vazia).
* Perfil → Sair: de volta ao login, de novo sem navegação explícita.
* Entrar como Administrador: o link *Administração* apareceu; `/admin` abre.
* Alguém da turma se cadastra; o admin toca em *Atualizar* e vê a conta.
  Reiniciar o servidor; atualizar de novo: a conta sumiu.
* Com o app logado, reiniciar o servidor e tocar em *Conferir token no
  servidor*: `401`. O token morreu com o processo — gancho para o exercício 1.
* Recarregar a página do app: volta ao login. A sessão vive na memória do app —
  gancho para a aula de persistência.
* Na web, abrir `/anotacoes` direto, sem login: a tela de login aparece e
  `usePathname()` já diz `/login`, mas a barra de endereço só é reescrita na
  próxima navegação. O que vale é o estado do navegador, não a URL.
