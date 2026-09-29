# Aula 6 — Autenticação com Context API

Aplicativo de exemplo com **cadastro**, **login**, **logout** e **rotas que
dependem de quem está logado**. O estado da sessão vive em um contexto React
(`AuthProvider` / `useAuth`), e os layouts do Expo Router leem esse contexto
para decidir quais telas existem.

O projeto tem duas partes:

| Pasta | O que é | Como rodar |
| --- | --- | --- |
| `server/` | API em Node.js (Express) com os dados **em memória** | `cd server && npm install && npm start` |
| raiz | App Expo (React Native) | `npm install && npx expo start` |

## Como executar

Dois terminais.

```bash
# terminal 1 — o servidor
cd Aula06/server
npm install
npm start
```

```bash
# terminal 2 — o app
cd Aula06
npm install
npx expo start
```

Depois: `w` para o navegador, `a` para Android, `i` para iOS.

O servidor imprime as **contas de teste** ao subir:

| E-mail | Senha | Papel |
| --- | --- | --- |
| `ana@ifrs.edu.br` | `123456` | usuário |
| `admin@ifrs.edu.br` | `admin123` | admin |

Qualquer conta criada pelo cadastro vale até o servidor ser reiniciado — o
"banco" é um `Map` na memória do processo (`server/banco.js`).

### O app não encontra o servidor?

O app descobre o endereço do servidor sozinho: usa o IP do computador em que o
Expo está rodando (`Constants.expoConfig.hostUri`) na porta 3000. Isso funciona
no navegador, no emulador e no celular físico **na mesma rede Wi-Fi**. Se
precisar apontar para outro lugar:

```bash
EXPO_PUBLIC_API_URL=http://192.168.0.10:3000 npx expo start
```

A tela de login mostra a URL que está sendo usada.

## A ideia central: um estado, muitos leitores

Quem está logado interessa a várias partes do app ao mesmo tempo:

* o layout raiz precisa saber se mostra o login ou o app;
* o layout do app precisa saber se a pessoa é admin;
* a tela inicial mostra o nome;
* a tela de anotações manda o token em cada requisição.

Passar isso por props não funciona — o layout raiz nem tem como passar props
para as telas. A **Context API** resolve com três peças, todas em
`src/contexts/auth-context.tsx`:

```tsx
// 1. o canal
const AuthContext = createContext<AuthContextValue | null>(null);

// 2. o provider: um componente comum que guarda o estado e o coloca no canal
export function AuthProvider({ children }) {
  const [sessao, setSessao] = useState<Sessao | null>(null);
  async function entrar(email, senha) { setSessao(await api.login(email, senha)); }
  async function sair() { /* ... */ setSessao(null); }
  return <AuthContext value={{ usuario: sessao?.usuario ?? null, token: sessao?.token ?? null, entrar, cadastrar, sair }}>{children}</AuthContext>;
}

// 3. o hook: qualquer componente abaixo do provider lê o canal
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (contexto === null) throw new Error('useAuth() só pode ser usado dentro de <AuthProvider>.');
  return contexto;
}
```

Quando `sessao` muda, **todo componente que chamou `useAuth()` re-renderiza**,
como se o estado fosse dele. O componente `SessaoAtual` (que aparece no login,
no início e no perfil) existe só para tornar isso visível.

## Rotas que dependem do usuário

O provider fica no layout raiz, envolvendo tudo. E o próprio layout raiz é o
primeiro leitor do contexto:

```tsx
// src/app/_layout.tsx
export default function RootLayout() {
  return (
    <AuthProvider>
      <RotasDoApp />
    </AuthProvider>
  );
}

function RotasDoApp() {
  const { usuario } = useAuth();
  const logado = usuario !== null;

  return (
    <Stack>
      <Stack.Protected guard={!logado}>
        <Stack.Screen name="(auth)" />   {/* login, cadastro */}
      </Stack.Protected>
      <Stack.Protected guard={logado}>
        <Stack.Screen name="(app)" />    {/* início, anotações, perfil, admin */}
      </Stack.Protected>
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
```

`<Stack.Protected guard={false}>` **remove** as rotas filhas do navegador. Duas
consequências:

1. Não dá para chegar nelas — nem por `Link`, nem por `router.push`, nem por
   link externo. O Expo Router leva para a primeira rota disponível.
2. Se o usuário está em uma delas quando o guard vira `false`, ele é levado
   embora na hora.

É por isso que **nenhuma tela chama `router.replace()` depois do login ou do
logout**. `entrar()` muda o estado, o layout re-renderiza com outro guard, e a
navegação acontece sozinha.

Dentro do grupo logado, a mesma ferramenta responde a outra pergunta — não
"está logado?", mas "quem é?":

```tsx
// src/app/(app)/_layout.tsx
<Stack.Protected guard={usuario?.papel === 'admin'}>
  <Stack.Screen name="admin" />
</Stack.Protected>
```

Para a Ana, `/admin` não existe. Para o Administrador, existe. A tela inicial
usa o mesmo `usuario` para decidir se mostra o link — o menu decide o que
**mostrar**, o layout decide o que **existe**.

> A proteção no app é só para a interface. O servidor confere de novo em toda
> requisição: `GET /usuarios` responde `403` para qualquer token que não seja
> de admin, não importa o que o app faça.

## Estrutura

```
src/app/
├── _layout.tsx            AuthProvider + Stack.Protected (logado / não logado)
├── (auth)/                só existe SEM usuário
│   ├── _layout.tsx        pilha login → cadastro (anchor: login)
│   ├── login.tsx          /login
│   └── cadastro.tsx       /cadastro
├── (app)/                 só existe COM usuário
│   ├── _layout.tsx        Stack.Protected para admin
│   ├── index.tsx          /            início: nome, menu
│   ├── anotacoes.tsx      /anotacoes   lista + criação, com o token
│   ├── perfil.tsx         /perfil      dados da sessão, sair
│   └── admin.tsx          /admin       lista de usuários (só admin)
└── +not-found.tsx

src/contexts/auth-context.tsx   AuthProvider, useAuth
src/services/api.ts             fetch + token no cabeçalho
src/models/usuario.ts           tipos Usuario, Sessao, Anotacao

server/
├── index.js               rotas HTTP (Express)
└── banco.js               Maps em memória, hash de senha, sessões
```

## O servidor

| Rota | Precisa de token? | Faz |
| --- | --- | --- |
| `POST /auth/cadastro` | não | cria a conta e já devolve `{ token, usuario }` |
| `POST /auth/login` | não | confere e-mail/senha e devolve `{ token, usuario }` |
| `GET /auth/me` | sim | devolve o usuário dono do token |
| `POST /auth/logout` | sim | invalida o token |
| `GET /anotacoes` | sim | anotações **do dono do token** |
| `POST /anotacoes` | sim | cria uma anotação para o dono do token |
| `GET /usuarios` | sim, de admin | todas as contas |

O token vai no cabeçalho `Authorization: Bearer <token>` — é o
`src/services/api.ts` quem coloca, a partir do `token` do contexto.

O servidor responde com um atraso artificial de 400 ms para os estados de
"carregando" ficarem visíveis. `ATRASO=0 npm start` desliga isso.

## Roteiro sugerido em aula

1. Subir o servidor e abrir `http://localhost:3000` no navegador: as rotas e as
   contas de teste.
2. Abrir o app no navegador (`w`). Reparar no `SessaoAtual`: `usuario null`.
3. Errar a senha: a mensagem veio do servidor (olhar o terminal: `401`).
4. Entrar como Ana. A tela trocou **sem nenhum `router.push`** — mostrar o
   `entrar()` no provider e o `guard` no layout raiz.
5. Início: o nome veio do contexto. Tocar em *Tentar abrir /admin*: nada
   acontece — a rota não existe para a Ana.
6. Anotações: cada toque aparece no terminal do servidor com o mesmo token.
7. Perfil → Sair: de volta ao login, de novo sem navegação explícita.
8. Entrar como Administrador: o link *Administração* apareceu, e `/admin` abre.
9. Cadastrar uma conta nova, voltar como admin e ver a lista. Reiniciar o
   servidor: a conta sumiu.
10. Com o app logado, reiniciar o servidor e tocar em *Conferir token no
    servidor*: `401` — o token morreu com o processo.

Na web, ao abrir uma URL protegida direto (por exemplo `/anotacoes` sem
login), a tela de login aparece e `usePathname()` já diz `/login`, mas a barra
de endereço só é reescrita na próxima navegação.

## Exercícios

1. Trate o `401` nas telas de anotações e admin: quando o servidor responder
   "não autenticado", chame `sair()` para o app voltar ao login sozinho.
2. Adicione `carregando` ao contexto e mostre uma tela de espera enquanto o
   login está em andamento (em vez de só desabilitar o botão).
3. Crie uma rota `/anotacoes/[id]` com os detalhes de uma anotação. Ela deve
   ficar dentro de `(app)` — por quê?
4. Crie um papel `moderador` no servidor e uma rota que só ele e o admin
   acessem. Quantos lugares precisaram mudar?
5. Guarde o token com `AsyncStorage` para a sessão sobreviver ao reload
   (assunto da aula de persistência — vale tentar antes).
6. O `AuthProvider` recria as funções `entrar`, `cadastrar` e `sair` a cada
   render. Investigue se isso é um problema neste projeto (dica: `reactCompiler`
   em `app.json`).
