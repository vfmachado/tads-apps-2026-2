## Aula 4 — Listas: `ScrollView`, `FlatList` e `keyExtractor`

**Objetivos**

* Exibir conjuntos de dados na tela.
* Saber quando usar `ScrollView` e quando usar `FlatList`.
* Entender o papel da chave (`key` / `keyExtractor`) na identidade de cada item.
* Montar uma lista completa: cabeçalho, separador, lista vazia, busca e recarga.

**Conteúdo**

* `ScrollView`: `style` × `contentContainerStyle`, rolagem horizontal.
* Listas com `.map()` e a prop `key`.
* `FlatList`: `data`, `renderItem`, `keyExtractor`.
* Componentes de apoio: `ListHeaderComponent`, `ListFooterComponent`, `ItemSeparatorComponent`, `ListEmptyComponent`.
* `refreshing` / `onRefresh`, `numColumns`, `horizontal`, `onEndReached`.
* Renderização sob demanda e impacto no desempenho.
* Listas e estado: imutabilidade e listas derivadas.

**Explicação**

### O problema

Uma `View` comum não rola: o que passa da altura da tela simplesmente some. E os dados quase nunca são fixos — vêm de um array que cresce, encolhe, é filtrado e reordenado.

São duas perguntas diferentes: **como rolar** e **como transformar um array em elementos**. `ScrollView` responde a primeira; `FlatList` responde as duas.

### `ScrollView`

É a `View` que rola. Só isso — e é importante entender o "só isso": ele renderiza **todos** os filhos de uma vez, estejam eles visíveis ou não.

```tsx
<ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
  <Header title="Perfil" />
  <Formulario />
</ScrollView>
```

#### `style` × `contentContainerStyle`

O erro mais comum da aula:

| Prop | O que estiliza | Onde entra |
|------|----------------|------------|
| `style` | o retângulo que rola | `flex: 1`, `backgroundColor` |
| `contentContainerStyle` | o conteúdo de dentro | `padding`, `gap`, `alignItems` |

`padding` em `style` corta o conteúdo; `gap` em `style` não faz efeito nenhum. Espaçamento vai sempre em `contentContainerStyle`.

#### Rolagem horizontal

```tsx
<ScrollView horizontal showsHorizontalScrollIndicator={false}>
  {CATEGORIAS.map((c) => <Chip key={c} label={c} />)}
</ScrollView>
```

#### Listas com `.map()`

Dentro de um `ScrollView` a lista é feita na mão:

```tsx
{TAREFAS.map((tarefa) => (
  <TarefaItem key={tarefa.id} tarefa={tarefa} />
))}
```

Repare no `key`: em JSX, todo elemento criado dentro de um `.map()` precisa de uma chave estável. É exatamente o mesmo papel do `keyExtractor` — guarde essa ideia.

**Quando usar `ScrollView`:** conteúdo pequeno e conhecido — um formulário, uma tela de detalhes, um carrossel de cinco itens. Se a quantidade vem de fora (uma API, um banco), use `FlatList`.

### `FlatList`

A `FlatList` recebe o array e cuida do resto: cria os itens visíveis, descarta os que saíram da tela e recria conforme o usuário rola. São três props na prática:

```tsx
<FlatList
  data={TAREFAS}                        // 1. o array
  renderItem={({ item }) => (           // 2. como desenhar UM item
    <TarefaItem tarefa={item} />
  )}
  keyExtractor={(item) => item.id}      // 3. quem é cada item
/>
```

`renderItem` recebe um **objeto**, não o item direto — por isso a desestruturação `{ item }`. O objeto completo é `{ item, index, separators }`.

```tsx
// ERRADO: `tarefa` aqui é { item, index, separators }, não a tarefa.
renderItem={(tarefa) => <TarefaItem tarefa={tarefa} />}

// CERTO:
renderItem={({ item }) => <TarefaItem tarefa={item} />}
```

A `FlatList` é um `ScrollView` por baixo — as mesmas `style` e `contentContainerStyle` valem aqui.

### `keyExtractor`

Entre uma renderização e outra, o React precisa saber **quem é quem**: qual item continuou, qual saiu, qual entrou. A chave é essa identidade.

```tsx
keyExtractor={(item) => item.id}          // certo
keyExtractor={(item) => String(item.id)}  // se o id for número
```

Sem `keyExtractor`, a `FlatList` tenta `item.key`, depois `item.id`, e por último cai no índice.

#### Por que o índice é um problema

O índice descreve a **posição**, não o item. Ao remover o primeiro elemento, todos os outros mudam de índice — e o React conclui que cada linha virou outra coisa.

```tsx
// Antes:  índice 0 = "Ler capítulo",  índice 1 = "Entregar trabalho"
// Depois: índice 0 = "Entregar trabalho"
// Para o React, o item 0 não foi removido: ele apenas "mudou de título".
```

Na prática isso aparece como: estado interno do item ficando na linha errada, texto digitado pulando de campo, animação e seleção grudadas na posição. A tela 3 do projeto mostra isso lado a lado.

**Regras da chave**

* Única dentro da lista.
* Estável — a mesma para o mesmo item, sempre.
* String.
* Nunca `Math.random()`: muda a cada render e faz o React recriar a lista inteira.

O índice só é aceitável quando a lista é fixa: nunca reordenada, filtrada, nem tem itens inseridos ou removidos no meio. Na dúvida, use um id.

### As props em volta da lista

A `FlatList` não desenha só os itens:

| Prop | Para que serve |
|------|----------------|
| `ListHeaderComponent` | Cabeçalho que rola junto (título, busca, filtros) |
| `ListFooterComponent` | Rodapé (contagem, botão "carregar mais") |
| `ItemSeparatorComponent` | Desenhado **entre** dois itens — nunca antes do primeiro nem depois do último |
| `ListEmptyComponent` | Aparece sozinho quando `data` está vazia, sem nenhum `if` na tela |
| `refreshing` + `onRefresh` | Pull-to-refresh pronto: um booleano e uma função |
| `numColumns` | Grade em vez de lista |
| `horizontal` | Lista deitada |
| `onEndReached` | Chamado ao chegar perto do fim — paginação (Aula 10) |
| `extraData` | Avisa a lista sobre um estado externo que afeta os itens |

```tsx
<FlatList
  data={visiveis}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <TarefaItem tarefa={item} />}
  ListEmptyComponent={<EmptyState titulo="Nada por aqui" />}
  ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
  refreshing={atualizando}
  onRefresh={recarregar}
/>
```

### Três armadilhas

**1. Cabeçalho como função.** Passe um **elemento**, não uma função inline:

```tsx
// ERRADO: um componente novo a cada render → o cabeçalho é remontado
// e o TextInput da busca perde o foco a cada tecla.
ListHeaderComponent={() => <Cabecalho />}

// CERTO:
ListHeaderComponent={<Cabecalho />}
```

**2. `FlatList` dentro de `ScrollView`** (no mesmo eixo). Os dois disputam a rolagem, e a `FlatList` fica com altura infinita — perdendo justamente a renderização sob demanda. Se o conteúdo em volta precisa rolar, ele vira o `ListHeaderComponent` da lista. Para listas curtas dentro de um `ScrollView`, use `scrollEnabled={false}`.

**3. Mutação do array.** Vale a mesma regra da Aula 3: o React compara referências.

```tsx
// ERRADO: mesma referência, nada é redesenhado.
tarefas.push(nova);
setTarefas(tarefas);

// CERTO: array novo.
setTarefas((anteriores) => [nova, ...anteriores]);

// Alterar um item: map devolve array novo com objeto novo no lugar do alterado.
setTarefas((anteriores) =>
  anteriores.map((t) => (t.id === id ? { ...t, concluida: !t.concluida } : t))
);

// Remover:
setTarefas((anteriores) => anteriores.filter((t) => t.id !== id));
```

### Lista derivada

Busca e filtro **não** são um novo `useState`. A lista visível é calculada a partir do estado que já existe:

```tsx
const visiveis = tarefas.filter(
  (t) =>
    t.titulo.toLowerCase().includes(busca.toLowerCase()) &&
    (categoria === null || t.categoria === categoria)
);

<FlatList data={visiveis} ... />
```

Guardar `visiveis` em um `useState` duplicaria a informação e abriria espaço para as duas ficarem fora de sincronia.

### Desempenho: o que "sob demanda" significa

Com 600 itens:

* `ScrollView` + `.map()` → cria os 600 componentes de uma vez, na abertura da tela.
* `FlatList` → cria umas poucas dezenas e vai criando o resto conforme a rolagem.

A tela 5 do projeto conta os itens efetivamente criados nas duas abordagens. Ajustes finos existem quando a lista pesa: `initialNumToRender`, `windowSize`, `maxToRenderPerBatch`, `removeClippedSubviews` e `getItemLayout` (quando todos os itens têm a mesma altura).

### Comparação

| | `ScrollView` | `FlatList` |
|---|---|---|
| Renderiza | tudo de uma vez | só o visível (+ margem) |
| Origem dos itens | JSX escrito na mão / `.map()` | array em `data` |
| Identidade do item | `key` no `.map()` | `keyExtractor` |
| Cabeçalho, vazio, separador | na mão | props prontas |
| Pull-to-refresh | `RefreshControl` manual | `refreshing` + `onRefresh` |
| Melhor para | conteúdo pequeno e fixo | listas longas ou dinâmicas |

Existe ainda a `SectionList`, para dados agrupados em seções (tarefas por categoria, contatos por letra). Mesma ideia, com `sections` no lugar de `data` e `renderSectionHeader`.

**Prática**

Projeto: `Aula04/`

```
cd Aula04
npm install
npx expo start
```

Telas:

* `src/app/index.tsx` — menu
* `src/app/scroll-view.tsx` — `ScrollView` vertical e horizontal, lista com `.map()`
* `src/app/flat-list.tsx` — anatomia da `FlatList`
* `src/app/chaves.tsx` — índice × id, lado a lado
* `src/app/lista-tarefas.tsx` — lista completa: busca, filtro, adicionar, concluir, remover, recarregar
* `src/app/desempenho.tsx` — 600 itens nas duas abordagens, com contagem

Dados: `src/models/tarefa.ts`. Componentes novos: `TarefaItem`, `EmptyState`, `Chip`, `Note`.

Exercícios:

1. Em `lista-tarefas`, mostre as tarefas concluídas por último (dica: `sort` sobre uma **cópia** do array).
2. Acrescente um `ListFooterComponent` com um botão "Limpar concluídas".
3. Troque a lista de `desempenho` para `numColumns={2}` e observe o que muda na contagem.
4. Em `chaves`, adicione um botão "Embaralhar" e veja o efeito nas duas listas.
5. Transforme `lista-tarefas` em uma `SectionList` agrupada por categoria.

**Para observar em aula**

* Abrir `scroll-view` e `flat-list`: o resultado na tela é o mesmo — a diferença está em quando cada item é criado.
* Em `chaves`: destacar o 3º item das duas listas e remover o primeiro. À esquerda o destaque fica parado na posição; à direita ele acompanha a tarefa.
* Em `lista-tarefas`: apagar o filtro até a lista ficar vazia — o `ListEmptyComponent` aparece sem nenhum `if` na tela.
* Trocar `ListHeaderComponent={<Cabecalho />}` por `{() => <Cabecalho />}` e digitar na busca: o foco se perde a cada tecla.
* Em `desempenho`: alternar entre as duas abordagens, medir, rolar até o fim e medir de novo.
