## Aula 3 — Estado (state) e formulários

**Objetivos**

* Entender o que é estado e por que ele existe.
* Controlar campos de entrada com `useState`.
* Evoluir de vários estados independentes para um estado em objeto.
* Conhecer o Formik como alternativa para formulários maiores.

**Conteúdo**

* `useState`: valor, função de atualização e nova renderização.
* Componentes controlados (`value` + `onChangeText`).
* Imutabilidade e atualização com *spread* (`...`).
* Estado derivado.
* Validação e mensagens de erro.
* Formik: `useFormik`, `values`, `errors`, `touched`, `handleSubmit`.

**Explicação**

### O que é estado

Props são dados que **chegam de fora** e o componente não pode alterar (Aula 2). Estado é o dado que **pertence ao componente** e pode mudar ao longo do tempo — o texto que o usuário digitou, um contador, se um switch está ligado.

A regra central do React: **quando o estado muda, o componente é renderizado de novo**. Uma variável comum não faz isso.

```tsx
// ERRADO: a variável muda, mas a tela não é redesenhada.
let contador = 0;
function Errado() {
  return <Pressable onPress={() => contador++}><Text>{contador}</Text></Pressable>;
}
```

### `useState`

`useState` é um *hook*: uma função do React que dá memória ao componente. Ele devolve um par — o valor atual e a função que troca esse valor.

```tsx
import { useState } from 'react';

const [contador, setContador] = useState(0);
//     ↑ valor    ↑ atualiza    ↑ valor inicial

setContador(1);                          // valor direto
setContador((anterior) => anterior + 1); // forma funcional
```

Use a **forma funcional** sempre que o novo valor depender do anterior. Chamadas de `set` são agrupadas pelo React, e `setContador(contador + 1)` duas vezes seguidas incrementaria apenas uma vez.

Regras dos hooks: sempre no topo do componente, nunca dentro de `if`, `for` ou funções aninhadas.

### Componentes controlados

No React Native o `TextInput` **não guarda o texto sozinho**. Ele exibe o que está no estado (`value`) e avisa quando o usuário digita (`onChangeText`). O estado é a única fonte da verdade.

```tsx
const [nome, setNome] = useState('');

<TextInput value={nome} onChangeText={setNome} />
```

A cada tecla: `onChangeText` → `setNome` → nova renderização → `value` atualizado. Sem `onChangeText`, o campo fica travado.

### Tela 1 — um `useState` para cada campo

`src/app/estado-simples.tsx`

```tsx
const [nome, setNome] = useState('');
const [email, setEmail] = useState('');
const [idade, setIdade] = useState('');
const [cidade, setCidade] = useState('');
const [receberNovidades, setReceberNovidades] = useState(false);

function limparFormulario() {
  setNome('');
  setEmail('');
  setIdade('');
  setCidade('');
  setReceberNovidades(false);
}
```

É a forma mais direta e legível — ótima para telas com poucos campos. O problema aparece na escala: 15 campos viram 15 estados, 15 setters, e toda operação que envolve o formulário inteiro (limpar, enviar, validar) precisa listar todos eles.

**Estado derivado.** Nem tudo precisa de `useState`. Se um valor pode ser calculado a partir do estado, calcule-o durante a renderização:

```tsx
// Certo: calculado a cada render.
const camposPreenchidos = [nome, email, idade, cidade].filter((v) => v.trim() !== '').length;

// Errado: duplica a informação e pode ficar desatualizado.
const [camposPreenchidos, setCamposPreenchidos] = useState(0);
```

### Tela 2 — um objeto no estado

`src/app/cadastro-objeto.tsx`

O formulário inteiro passa a ser **um** estado. O modelo fica em `src/models/cadastro.ts`:

```tsx
export interface Cadastro {
  nome: string;
  email: string;
  senha: string;
  confirmacaoSenha: string;
  cidade: string;
  aceitaTermos: boolean;
}

export const CADASTRO_VAZIO: Cadastro = { nome: '', email: '', /* ... */ aceitaTermos: false };
```

```tsx
const [cadastro, setCadastro] = useState<Cadastro>(CADASTRO_VAZIO);
```

#### Imutabilidade

Objetos no estado **nunca** são alterados no lugar. Criamos um objeto novo:

```tsx
// ERRADO: o React compara referências. O objeto é o mesmo, então nada é redesenhado.
cadastro.nome = 'Ana';
setCadastro(cadastro);

// CERTO: copia tudo (...anterior) e troca só o campo desejado.
setCadastro((anterior) => ({ ...anterior, nome: 'Ana' }));
```

Com uma chave dinâmica, uma única função atualiza qualquer campo:

```tsx
function atualizarCampo<C extends keyof Cadastro>(campo: C, valor: Cadastro[C]) {
  setCadastro((anterior) => ({ ...anterior, [campo]: valor }));
}

<TextField value={cadastro.email} onChangeText={(texto) => atualizarCampo('email', texto)} />
```

O genérico `<C extends keyof Cadastro>` faz o TypeScript trabalhar a favor: `atualizarCampo('nome', true)` não compila, porque `nome` é `string`.

E limpar o formulário volta a ser uma linha: `setCadastro(CADASTRO_VAZIO)`.

#### Validação

Os erros seguem a mesma ideia — um objeto com a mesma forma do formulário:

```tsx
export type ErrosCadastro = Partial<Record<keyof Cadastro, string>>;

export function validarCadastro(cadastro: Cadastro): ErrosCadastro {
  const erros: ErrosCadastro = {};
  if (cadastro.nome.trim().length < 3) erros.nome = 'Informe pelo menos 3 caracteres.';
  if (!cadastro.email.includes('@')) erros.email = 'Informe um e-mail válido.';
  if (cadastro.confirmacaoSenha !== cadastro.senha) erros.confirmacaoSenha = 'As senhas não conferem.';
  return erros;
}

function enviar() {
  const novosErros = validarCadastro(cadastro);
  setErros(novosErros);
  if (Object.keys(novosErros).length > 0) return; // tem erro, não envia
  // ... envio
}
```

Sobra ainda bastante trabalho manual: decidir **quando** mostrar cada erro, limpar o erro quando o usuário corrige o campo, saber se ele já mexeu no formulário. É exatamente esse trabalho que o Formik assume.

### Tela 3 — o mesmo cadastro com Formik

`src/app/cadastro-formik.tsx`

```
npx expo install formik
```

`useFormik` substitui os `useState` de valores, erros e campos visitados:

```tsx
import { useFormik } from 'formik';

const formik = useFormik<Cadastro>({
  initialValues: CADASTRO_VAZIO,
  validate: validarCadastro,          // a MESMA função da tela 2
  onSubmit: (values) => setEnviado(values), // só roda se não houver erros
});
```

Ligando ao `TextInput`:

```tsx
<TextField
  label="E-mail"
  value={formik.values.email}
  onChangeText={formik.handleChange('email')}
  onBlur={formik.handleBlur('email')}
  error={formik.touched.email ? formik.errors.email : undefined}
/>

<PrimaryButton label="Cadastrar" onPress={() => formik.handleSubmit()} />
```

O que o Formik oferece:

| Item | Para que serve |
|------|----------------|
| `values` | Os valores atuais (o nosso objeto `cadastro`) |
| `errors` | Resultado da validação |
| `touched` | Campos em que o usuário já entrou e saiu — evita acusar erro enquanto ele digita |
| `handleChange(campo)` | Devolve a função que atualiza aquele campo |
| `handleBlur(campo)` | Marca o campo como visitado |
| `handleSubmit()` | Valida, marca tudo como visitado e chama `onSubmit` se estiver válido |
| `resetForm()` | Volta valores, erros e `touched` ao estado inicial |
| `dirty`, `submitCount` | Se o formulário foi alterado e quantas tentativas de envio houve |

Dois detalhes do React Native:

* `handleSubmit` foi feito para formulários da web, então chame-o dentro de uma *arrow function*: `onPress={() => formik.handleSubmit()}`.
* Campos que não são texto (como o `Switch`) usam `formik.setFieldValue('aceitaTermos', valor)`.

**Importante:** o Formik não valida sozinho. As regras continuam sendo nossas — as três telas usam a mesma `validarCadastro`. O que muda é quem cuida do estado.

### Comparação

| | Vários `useState` | Objeto no estado | Formik |
|---|---|---|---|
| Código para 5 campos | 5 estados + 5 setters | 1 estado + 1 função | 1 hook |
| Limpar formulário | um setter por campo | uma linha | `resetForm()` |
| Erros | manual | manual | pronto |
| "já mexeu no campo?" | manual | manual | `touched` |
| Dependência externa | não | não | sim |
| Melhor para | telas simples | formulários médios | formulários grandes |

Não existe opção "certa": para dois campos, `useState` direto é mais claro que qualquer biblioteca.

**Prática**

Projeto: `Aula03/`

```
cd Aula03
npm install
npx expo start
```

Telas:

* `src/app/index.tsx` — menu
* `src/app/estado-simples.tsx` — vários `useState` + contador
* `src/app/cadastro-objeto.tsx` — estado em objeto
* `src/app/cadastro-formik.tsx` — o mesmo cadastro com Formik

Componentes novos: `TextField`, `SwitchField`, `StatePreview`, `MenuLink`.

Exercícios:

1. Acrescente um campo "telefone" nas três telas e compare o esforço em cada uma.
2. Na tela 1, faça o botão "Limpar" ficar desabilitado quando nenhum campo estiver preenchido.
3. Na tela 2, mostre o erro apenas depois da primeira tentativa de envio (dica: um `useState` para `jaEnviou`).
4. Na tela 3, troque o `validate` por um schema do [Yup](https://github.com/jquense/yup) usando `validationSchema`.

**Para observar em aula**

Abrindo as telas 2 e 3 lado a lado, com o mesmo formulário e a mesma `validarCadastro`:

* Quantas linhas cada tela gasta só para *guardar* os dados — e o que sobra de código realmente sobre cadastro.
* O que acontece com o erro enquanto o usuário ainda está digitando: na tela 2 decidimos isso na mão; na tela 3, o `touched` já resolve.
* O que `limpar` precisa fazer em cada versão.
* O que o Formik **não** faz: as regras de validação continuam sendo as mesmas nas duas telas.
* Quando o Formik atrapalha mais do que ajuda — por exemplo, na tela 1, com poucos campos.
