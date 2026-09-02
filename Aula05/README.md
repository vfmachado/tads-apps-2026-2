# Aula 5 — Navegação entre telas (Expo Router)

Aplicativo de exemplo com **abas**, **pilha**, **tela de detalhes com parâmetro**,
**modal** e **rota não encontrada**. Cada arquivo de `src/app` é uma rota, e o
código está comentado apontando o conceito que ele demonstra.

## Como executar

```bash
cd Aula05
npm install
npx expo start
```

Depois: `a` para Android, `i` para iOS, `w` para o navegador. No navegador dá
para ver a URL mudando a cada navegação — vale a pena deixar aberto durante a
aula.

## A ideia central: a pasta é o roteador

No Expo Router não existe um arquivo de rotas. **O caminho do arquivo dentro de
`src/app` é a URL da tela.** Criar `src/app/sobre.tsx` cria a rota `/sobre`;
apagar o arquivo apaga a rota.

| Arquivo | Rota | O que é |
| --- | --- | --- |
| `src/app/_layout.tsx` | — | Layout raiz: `Stack` (pilha) que envolve tudo |
| `src/app/(tabs)/_layout.tsx` | — | Layout das abas: `Tabs` |
| `src/app/(tabs)/index.tsx` | `/` | Aba **Tarefas** — listagem |
| `src/app/(tabs)/explorar.tsx` | `/explorar` | Aba **Explorar** — categorias |
| `src/app/(tabs)/ajustes.tsx` | `/ajustes` | Aba **Ajustes** — preferências e atalhos |
| `src/app/tarefa/[id].tsx` | `/tarefa/t3` | Detalhes de uma tarefa (parâmetro de caminho) |
| `src/app/categoria/[nome].tsx` | `/categoria/Estudo?ordem=za` | Lista filtrada (caminho + query) |
| `src/app/pilha.tsx` | `/pilha?nivel=2` | Laboratório: `push` × `replace` × `navigate` |
| `src/app/sobre.tsx` | `/sobre` | Tela apresentada como **modal** |
| `src/app/+not-found.tsx` | qualquer outra | Rota não encontrada |

Três convenções de nome aparecem aí:

* `_layout.tsx` — **não é tela**: define o navegador que envolve as rotas ao lado
  e abaixo dele.
* `[id]`, `[nome]` — **segmento dinâmico**: qualquer valor cai nessa tela e chega
  como parâmetro.
* `(tabs)` — **grupo**: organiza arquivos sem aparecer na URL. Por isso
  `(tabs)/index.tsx` é `/` e não `/tabs`.
* `+not-found.tsx` — rota especial de fallback (o `+` marca rotas especiais).

## Os dois navegadores usados aqui

**Stack (pilha)** — telas empilhadas. A nova entra por cima, o botão voltar
remove a de cima. É o padrão de *listagem → detalhes*.

**Tabs (abas)** — telas irmãs. Trocar de aba não cria histórico e **não desmonta**
a aba anterior: o estado dela continua vivo. (Teste em Ajustes: ligue um
interruptor, vá para Tarefas e volte.)

Neste projeto os dois estão **aninhados**: o grupo `(tabs)` é *uma* tela da pilha
raiz. Por isso a tela de detalhes cobre a barra de abas — ela é empilhada acima
do grupo inteiro.

```
Stack (raiz)
├── (tabs)          ← Tabs: Tarefas | Explorar | Ajustes
├── tarefa/[id]     ← entra por cima das abas
├── categoria/[nome]
├── pilha
├── sobre           ← presentation: 'modal'
└── +not-found
```

## Navegar: as duas formas

Declarativa, quando o destino é fixo e o toque é o gesto natural
(`src/app/(tabs)/explorar.tsx`):

```tsx
<Link href={{ pathname: '/categoria/[nome]', params: { nome: 'Estudo' } }} asChild>
  <CategoriaCard ... />
</Link>
```

Programática, quando o destino depende de uma decisão em código — validação,
resposta de API, item tocado (`src/app/(tabs)/index.tsx`):

```tsx
const router = useRouter();
router.push({ pathname: '/tarefa/[id]', params: { id: item.id } });
```

`asChild` faz o `Link` usar o componente filho como área de toque, em vez de
renderizar um `<Text>` próprio. O filho precisa aceitar `onPress` — veja o
`...rest` em `src/components/categoria-card.tsx`.

### Métodos do `router`

| Método | O que faz |
| --- | --- |
| `push(href)` | Empilha uma nova tela (a atual continua embaixo) |
| `replace(href)` | Troca a tela atual — a pilha não cresce |
| `navigate(href)` | Reaproveita a tela quando a rota já está na pilha |
| `back()` | Uma tela para trás — proteja com `canGoBack()` |
| `dismissAll()` | Volta ao início da pilha |
| `dismissTo(href)` | Fecha telas até chegar no destino |
| `setParams(params)` | Muda os parâmetros da rota atual, sem navegar |

A tela `/pilha` existe para comparar os três primeiros: ela abre a si mesma com
um nível maior e mostra quantas telas estão empilhadas.

## Parâmetros

O parâmetro identifica o dado — **não carrega o dado**. A tela de detalhes
recebe `id` e busca a tarefa em `src/models/tarefa.ts`, exatamente como faria
com uma API.

```tsx
// src/app/tarefa/[id].tsx
const { id } = useLocalSearchParams<{ id: string }>();
const tarefa = buscarTarefa(id);
```

Dois tipos convivem em `/categoria/Estudo?ordem=za`:

* `nome` vem do **caminho** (`[nome]`) — define *o que* a tela mostra;
* `ordem` vem da **query** (`?ordem=za`) — define *como* ela mostra, e é opcional.

Todo parâmetro chega como **string**: `Number(nivel)` em `pilha.tsx` existe por
isso.

`useLocalSearchParams()` devolve os parâmetros **desta** tela;
`useGlobalSearchParams()` devolve os da URL inteira e atualiza mesmo quando a
tela está atrás de outra na pilha. Em telas de conteúdo, use a versão local.

O componente `src/components/rota-atual.tsx` mostra `usePathname()`,
`useSegments()` e `useLocalSearchParams()` ao vivo — ele aparece em várias
telas justamente para tornar isso visível.

## Cabeçalho: onde configurar

No layout, quando o título é fixo:

```tsx
<Stack.Screen name="pilha" options={{ title: 'Pilha de navegação' }} />
```

Na própria tela, quando o título depende do dado carregado:

```tsx
<Stack.Screen options={{ title: tarefa.titulo }} />
```

O `<Stack.Screen>` dentro do layout **não renderiza nada** — só configura a rota
de mesmo nome. Dentro da tela, ele configura a tela atual.

## Roteiro sugerido em aula

1. Abrir no navegador e navegar pelas abas olhando a URL.
2. Tocar em uma tarefa: a tela de detalhes cobre a barra de abas.
3. Em detalhes, usar **Próxima tarefa (push)** três vezes e contar os "voltar".
   Refazer com **replace**.
4. Em `/categoria/Estudo`, tocar em *Ordenar Z→A*: a URL muda, a tela não é
   reaberta (`setParams`).
5. Abrir **Sobre** (modal) e fechar arrastando para baixo.
6. Em Ajustes, tocar em *Ir para /configuracoes/tema* para cair no `+not-found`.
7. Criar `src/app/agenda.tsx` com um `Text` e abrir `/agenda` sem reiniciar nada.

## Exercícios

1. Adicione uma quarta aba **Concluídas** listando apenas tarefas concluídas.
2. Faça o cartão de categoria abrir a lista já ordenada Z→A (dica: `params`).
3. Crie `src/app/tarefa/[id]/editar.tsx` e navegue até lá a partir dos detalhes.
4. Faça o botão *Fechar* do modal usar `dismissTo('/ajustes')` e explique a
   diferença em relação a `back()`.
5. Esconda a aba Explorar da barra usando `href: null` em `Tabs.Screen` — a rota
   continua acessível por link?
