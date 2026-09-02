## Aula 5 — Navegação entre telas: Expo Router, Stack, Tabs e parâmetros

**Objetivos**

* Entender rotas baseadas em arquivos: a pasta `src/app` é o roteador.
* Montar os dois navegadores mais comuns: pilha (`Stack`) e abas (`Tabs`).
* Navegar de forma declarativa (`Link`) e programática (`router`).
* Passar dados entre telas por parâmetros de caminho e de query.
* Configurar cabeçalho, modal e rota não encontrada.

**Conteúdo**

* Expo Router: arquivo → rota; `_layout.tsx`; grupos `(pasta)`; rotas `+especiais`.
* `Stack`: `push`, `replace`, `back`, `dismissAll`, `dismissTo`, `navigate`.
* `Tabs`: abas irmãs, `tabBarIcon`, `tabBarBadge`, estado preservado.
* Aninhamento: abas dentro da pilha; telas que cobrem a barra de abas.
* Segmentos dinâmicos `[id]` e `useLocalSearchParams`.
* Query params e `router.setParams`.
* Opções de tela: `title`, `headerShown`, `presentation: 'modal'`.
* `+not-found`, `usePathname`, `useSegments`, `_sitemap`.

**Explicação**

### O problema

Até aqui cada projeto tinha telas soltas e um menu improvisado. Um aplicativo de
verdade tem **fluxos**: uma lista que abre um detalhe, um detalhe que volta, abas
que trocam de contexto sem perder o que estava aberto, um formulário que sobe
como modal.

Duas perguntas: **como declarar as telas** e **como ir de uma para a outra**.

### A pasta é o roteador

No Expo Router não existe um arquivo de configuração de rotas. O caminho do
arquivo dentro de `src/app` **é** a URL:

```
src/app/index.tsx          ->  /
src/app/ajustes.tsx        ->  /ajustes
src/app/tarefa/[id].tsx    ->  /tarefa/t3
src/app/+not-found.tsx     ->  qualquer caminho sem arquivo
```

Criar o arquivo cria a rota. Apagar o arquivo apaga a rota. Não há nada para
registrar em lugar nenhum — e é por isso que a organização das pastas passa a
ser uma decisão de arquitetura (assunto da Aula 9).

Três convenções de nome:

| Nome | O que significa |
|------|-----------------|
| `_layout.tsx` | Não é tela: define o navegador que envolve as rotas ao lado e abaixo |
| `[id].tsx` | Segmento dinâmico: qualquer valor cai nessa tela e chega como parâmetro |
| `(tabs)/` | Grupo: organiza arquivos **sem** aparecer na URL |
| `+not-found.tsx` | Rota especial (o `+` marca as especiais) |

O grupo é o detalhe que mais confunde: `src/app/(tabs)/index.tsx` responde por
`/`, não por `/tabs`. Os parênteses existem só para agrupar as telas sob um
layout comum.

### `_layout.tsx`: quem desenha a moldura

Cada layout escolhe **um navegador** e vale para tudo que está na mesma pasta e
abaixo dela.

```tsx
// src/app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerTintColor: Colors.text }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="tarefa/[id]" options={{ title: 'Detalhes' }} />
      <Stack.Screen name="sobre" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
```

Ponto importante: **`<Stack.Screen>` dentro do layout não renderiza a tela.** Ele
só configura opções da rota de mesmo nome — a tela continua sendo o arquivo. Se
você não declarar nada, a rota funciona do mesmo jeito, só que com as opções
padrão.

### `Stack` — a pilha

Telas empilhadas: a nova entra por cima, o botão voltar (ou o gesto) remove a de
cima. É o fluxo *listagem → detalhes*.

```tsx
router.push('/tarefa/t3');   // empilha
router.back();               // desempilha
```

### `Tabs` — as abas

```tsx
// src/app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router/js-tabs';

<Tabs screenOptions={{ tabBarActiveTintColor: Colors.primary }}>
  <Tabs.Screen name="index" options={{ title: 'Tarefas' }} />
  <Tabs.Screen name="explorar" options={{ title: 'Explorar', tabBarBadge: 4 }} />
  <Tabs.Screen name="ajustes" options={{ title: 'Ajustes' }} />
</Tabs>
```

As abas são **irmãs**, não empilhadas. Duas consequências práticas:

* trocar de aba não cria histórico — o "voltar" não desfaz a troca;
* a aba que perde o foco **não é desmontada**: o estado dela continua vivo.

> Em tutoriais antigos o import é `import { Tabs } from 'expo-router'`. A partir
> do SDK 57 esse caminho está depreciado em favor de `expo-router/js-tabs`. Os
> dois ainda funcionam.

### Aninhar navegadores

O projeto da aula tem abas **dentro** da pilha:

```
Stack (raiz)
├── (tabs)            ← Tabs: Tarefas | Explorar | Ajustes
├── tarefa/[id]       ← empilhada POR CIMA das abas
├── categoria/[nome]
├── pilha
├── sobre             ← presentation: 'modal'
└── +not-found
```

O grupo `(tabs)` é **uma** tela da pilha raiz. Por isso a tela de detalhes cobre
a barra de abas: ela foi empilhada acima do grupo inteiro. Se a intenção fosse o
contrário — detalhes com a barra de abas visível —, o arquivo teria que estar
dentro de `(tabs)`.

E, como o grupo já tem o cabeçalho das abas, o layout raiz esconde o dele:
`options={{ headerShown: false }}`. Sem isso aparecem dois cabeçalhos.

### Navegar: as duas formas

**Declarativa** — o destino é fixo e está escrito no JSX:

```tsx
<Link href="/ajustes">Ajustes</Link>

<Link href={{ pathname: '/categoria/[nome]', params: { nome: 'Estudo' } }} asChild>
  <CategoriaCard categoria="Estudo" total={3} />
</Link>
```

`asChild` faz o `Link` usar o filho como área de toque, em vez de renderizar um
`<Text>` próprio. O filho precisa **aceitar e repassar** `onPress` — por isso o
`...rest` no `CategoriaCard`.

**Programática** — o destino depende de uma decisão em código (item tocado,
validação, resposta de API):

```tsx
const router = useRouter();

router.push({ pathname: '/tarefa/[id]', params: { id: item.id } });
```

Repare na forma de objeto: `pathname` é o nome do **arquivo** da rota, com o
`[id]` literal; `params` preenche o segmento. Concatenar string
(`` `/tarefa/${id}` ``) também funciona, mas perde a verificação do TypeScript e
não escapa caracteres especiais.

### `push`, `replace`, `navigate`, `back`

| Método | Efeito na pilha |
|--------|-----------------|
| `push(href)` | Empilha uma tela nova; a atual continua embaixo |
| `replace(href)` | Troca a tela atual; a pilha **não** cresce e a anterior não volta |
| `navigate(href)` | Se a rota já é a atual, reaproveita a tela e só troca os parâmetros; senão, empilha |
| `back()` | Uma tela para trás |
| `dismissAll()` | Volta ao início da pilha |
| `dismissTo(href)` | Fecha telas até chegar no destino |
| `setParams(params)` | Muda parâmetros da rota atual — não navega |

Quando usar `replace`: depois de um login, depois de salvar um cadastro, em
qualquer tela que o usuário não deveria reencontrar apertando "voltar".

`back()` só é seguro quando há para onde voltar. Ao abrir o app direto por um
link (deep link), a tela de detalhes pode ser a primeira da pilha:

```tsx
<PrimaryButton label="Voltar" disabled={!router.canGoBack()} onPress={() => router.back()} />
```

### Parâmetros

O parâmetro identifica o dado — **ele não carrega o dado**. Passa-se o `id`; a
tela de destino busca o objeto:

```tsx
// src/app/tarefa/[id].tsx
const { id } = useLocalSearchParams<{ id: string }>();
const tarefa = buscarTarefa(id);

if (!tarefa) return <EmptyState titulo="Não encontramos essa tarefa" />;
```

Isso não é burocracia: é o mesmo desenho que funciona quando os dados vêm de uma
API (Aula 10) e o que garante que abrir `/tarefa/t3` direto pelo link mostre a
tela certa.

Duas origens diferentes, na mesma rota `/categoria/Estudo?ordem=za`:

| Parâmetro | Vem de | Serve para |
|-----------|--------|-----------|
| `nome` | caminho — `[nome]` | dizer **o que** a tela mostra; identifica a tela |
| `ordem` | query — `?ordem=za` | dizer **como** ela mostra; é opcional |

Três detalhes que geram bug:

1. **Todo parâmetro chega como string.** `nivel` vale `"2"`, não `2` — converta
   com `Number(...)`.
2. **A rota existir não significa o dado existir.** `/tarefa/t999` é uma rota
   válida; tratar o "não encontrado" é da tela.
3. **`useLocalSearchParams` × `useGlobalSearchParams`.** O local devolve os
   parâmetros *desta* tela e não muda quando ela está atrás de outra na pilha.
   O global acompanha a URL inteira e re-renderiza telas que ficaram para trás.
   Em tela de conteúdo, use o local.

E, para mudar um parâmetro sem navegar:

```tsx
router.setParams({ ordem: 'za' });   // a URL muda, a tela não é reaberta
```

### O cabeçalho

Duas maneiras, e a escolha é sobre **quando o título é conhecido**:

```tsx
// título fixo: no layout
<Stack.Screen name="pilha" options={{ title: 'Pilha de navegação' }} />

// título que depende do dado: na própria tela
<Stack.Screen options={{ title: tarefa.titulo }} />
```

Outras opções úteis: `headerShown`, `headerBackTitle`, `headerRight` (um botão no
canto), `animation`, `contentStyle`.

### Modal

Modal não é um componente: é uma **opção de apresentação** de uma tela comum.

```tsx
<Stack.Screen name="sobre" options={{ presentation: 'modal', title: 'Sobre' }} />
```

O arquivo `sobre.tsx` não sabe que é um modal — e fechar é simplesmente voltar
(`router.back()`). Mudar aquela linha transforma o modal em tela empilhada.

### Rota não encontrada

`src/app/+not-found.tsx` recebe qualquer caminho sem arquivo correspondente —
inclusive links vindos de fora do app e URLs digitadas na web. Vale sempre
escrever uma, com um caminho de volta para `/`.

Durante o desenvolvimento, a rota `/_sitemap` lista todas as rotas do projeto.

### Onde eu estou?

```tsx
usePathname()            // '/tarefa/t3'          — caminho resolvido
useSegments()            // ['tarefa', '[id]']    — pedaços do arquivo
useLocalSearchParams()   // { id: 't3' }          — parâmetros da tela
```

`useSegments()` é o que se usa para decidir coisas como "estou dentro do grupo
`(auth)`?" — a base da proteção de rotas da Aula 13.

### Três armadilhas

**1. Dois cabeçalhos.** Um `Stack` por fora de um `Tabs` mostra o cabeçalho dos
dois. Esconda um: `headerShown: false`.

**2. `Link` com filho que ignora `onPress`.** Com `asChild`, o `Link` injeta
`onPress` no filho. Se o componente não repassar esse `onPress` ao `Pressable`,
o toque não navega — e não há erro nenhum na tela.

**3. Empilhar a mesma tela sem perceber.** Uma tela de detalhes que abre outra
tela de detalhes com `push` cresce indefinidamente: cinco toques, cinco
"voltar". Quando o certo é *trocar* de item, use `replace`.

### Comparação

| | `Stack` | `Tabs` |
|---|---|---|
| Relação entre telas | empilhadas | irmãs |
| Histórico | sim, botão voltar | não |
| Tela anterior | continua montada embaixo | continua montada, sem foco |
| Gesto | voltar arrastando | trocar tocando na barra |
| Usar quando | listagem → detalhes, fluxos | seções paralelas do app |

Existem ainda `Drawer` (menu lateral) e `TopTabs` (abas superiores), com a mesma
lógica de layout.

**Prática**

Projeto: `Aula05/`

```
cd Aula05
npm install
npx expo start
```

Rotas:

* `src/app/_layout.tsx` — pilha raiz, modal e `+not-found`
* `src/app/(tabs)/_layout.tsx` — as três abas
* `src/app/(tabs)/index.tsx` — listagem; navegação programática com `router.push`
* `src/app/(tabs)/explorar.tsx` — categorias; navegação declarativa com `Link`
* `src/app/(tabs)/ajustes.tsx` — configurações e atalhos para as demais rotas
* `src/app/tarefa/[id].tsx` — detalhes; parâmetro de caminho e título dinâmico
* `src/app/categoria/[nome].tsx` — caminho + query, com `setParams`
* `src/app/pilha.tsx` — `push` × `replace` × `navigate`, com contador de telas
* `src/app/sobre.tsx` — modal
* `src/app/+not-found.tsx` — rota inexistente

Componentes novos: `RotaAtual` (mostra `pathname`, `segments` e `params` ao
vivo), `CategoriaCard`, `LinhaConfig`, `TabBarIcon`. Dados: `src/models/tarefa.ts`.

Exercícios:

1. Crie a aba **Concluídas**, listando apenas as tarefas concluídas.
2. Faça o cartão de categoria já abrir a lista ordenada Z→A (dica: `params`).
3. Crie `src/app/tarefa/[id]/editar.tsx` e chegue lá a partir dos detalhes.
   O que acontece com o arquivo `tarefa/[id].tsx` existente?
4. Troque o `Fechar` do modal por `dismissTo('/ajustes')` e explique a diferença
   em relação a `back()`.
5. Esconda a aba Explorar da barra com `href: null` no `Tabs.Screen`. A rota
   continua acessível por link direto?
6. Adicione um `headerRight` na tela de detalhes com um botão que abre o modal.

**Para observar em aula**

* Abrir no navegador (`w`) e navegar pelas abas com a URL à vista: `/`,
  `/explorar`, `/ajustes` — o grupo `(tabs)` não aparece em lugar nenhum.
* Tocar em uma tarefa: a tela de detalhes cobre a barra de abas. Perguntar por
  quê antes de mostrar o layout raiz.
* Em detalhes: **Próxima tarefa (push)** três vezes, contando os "voltar";
  refazer com **replace**.
* Em Ajustes: ligar um interruptor, ir para Tarefas e voltar — o estado da aba
  continua lá. Depois, empilhar `/pilha`, voltar e comparar.
* Em `/categoria/Estudo`: tocar em *Ordenar Z→A* — a URL muda, o cabeçalho não
  pisca, a tela não é reaberta.
* Abrir **Sobre**: modal sobe de baixo, fecha arrastando; e é uma tela comum.
* Tocar em *Ir para /configuracoes/tema*: cai no `+not-found`. Criar o arquivo
  `src/app/configuracoes/tema.tsx` com o app rodando e tocar de novo.
* Abrir `/_sitemap` e comparar a lista com a árvore de arquivos de `src/app`.
