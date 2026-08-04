## Aula 2 — Componentes e propriedades

**Objetivos**

* Criar componentes funcionais.
* Passar informações por propriedades.
* Compor interfaces reutilizáveis.

**Conteúdo**

* JSX e componentes.
* `View`, `Text`, `Image` e `Pressable`.
* Props tipadas com TypeScript.
* Composição e reutilização.
* Diferenças entre elementos HTML e componentes nativos.

**Explicação**

### JSX e componentes

JSX é a sintaxe que mistura marcação (parecida com HTML) com JavaScript/TypeScript. Um componente é uma função que recebe `props` e retorna JSX descrevendo a interface.

```tsx
function Ola() {
  return <Text>Olá, mundo!</Text>;
}
```

### `View`, `Text`, `Image` e `Pressable`

São os blocos básicos do React Native — equivalentes nativos a elementos HTML, porém renderizados como componentes de UI reais (não HTML/DOM):

* `View` — contêiner de layout, como uma `div`.
* `Text` — único componente que pode exibir texto.
* `Image` — exibe imagens locais ou remotas.
* `Pressable` — captura toques (equivalente a um botão/área clicável).

```tsx
import { View, Text, Image, Pressable } from "react-native";

function Cartao() {
  return (
    <View>
      <Image source={{ uri: "https://exemplo.com/avatar.png" }} />
      <Text>Vinícius</Text>
      <Pressable onPress={() => console.log("clicado")}>
        <Text>Ver perfil</Text>
      </Pressable>
    </View>
  );
}
```

### Props tipadas com TypeScript

Props são os parâmetros de um componente. Com TypeScript, definimos uma `interface` (ou `type`) descrevendo seu formato.

```tsx
interface SaudacaoProps {
  nome: string;
  idade?: number; // opcional
}

function Saudacao({ nome, idade }: SaudacaoProps) {
  return <Text>Olá, {nome}{idade ? ` (${idade})` : ""}!</Text>;
}
```

### Composição e reutilização

Componentes pequenos podem ser combinados para formar telas maiores, evitando repetição de código.

```tsx
function Botao({ texto, onPress }: { texto: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <Text>{texto}</Text>
    </Pressable>
  );
}

function Tela() {
  return (
    <View>
      <Saudacao nome="Ana" />
      <Botao texto="Entrar" onPress={() => {}} />
    </View>
  );
}
```

### Diferenças entre elementos HTML e componentes nativos

| HTML (web)   | React Native      |
|--------------|--------------------|
| `<div>`      | `<View>`           |
| `<p>`/`<span>`| `<Text>`           |
| `<img>`      | `<Image>`          |
| `<button>`   | `<Pressable>` / `<Button>` |
| CSS (`class`)| `StyleSheet`/objeto `style` |

Principais diferenças: não há DOM/HTML no React Native — os componentes são traduzidos para views nativas do iOS/Android; todo texto deve ficar dentro de `<Text>`; estilos usam Flexbox por padrão e são definidos via objetos JS, não classes CSS.

**Prática**

Criar:

* `Header`
* `TaskCard`
* `PrimaryButton`
