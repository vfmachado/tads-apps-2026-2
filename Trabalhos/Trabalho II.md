# Trabalho Prático II — Autenticação, Contexto e Rotas Protegidas

**Disciplina:** Desenvolvimento de Aplicativos · **Valor:** 10,0 pontos · **Modalidade:** individual
**Entrega:** até 20/10/2026, pelo ambiente virtual da disciplina.

## 1. Objetivo

Avaliar a capacidade de evoluir um aplicativo com autenticação real, demonstrando domínio da Context API, do fluxo de login/logout com token, de rotas protegidas com `Stack.Protected`, da comunicação autenticada com uma API e da separação entre o que o app protege (interface) e o que o servidor protege (autorização).

## 2. Descrição da Atividade

O ponto de partida é o projeto da **Aula 6** (`Aula06/`): o app Expo e o servidor em `Aula06/server/`. Copie a pasta inteira para o seu repositório e implemente sobre ela os **seis requisitos** da seção 4.

O trabalho mexe nos dois lados: alguns requisitos são só no app, outros exigem mudar também o servidor. Em cada requisito está indicado onde é esperado mexer.

O código já existente pode (e deve) ser modificado e reorganizado. O que for acrescentado deve ser de autoria do aluno.

## 3. Requisitos Gerais

* **React Native + Expo + TypeScript**, a partir do projeto da Aula 6.
* O estado de autenticação continua na **Context API** (`AuthProvider` / `useAuth`). Não use Redux, Zustand ou bibliotecas equivalentes.
* A navegação depois de login, logout, sessão expirada e restauração de sessão continua sendo **consequência do estado**: nada de `router.replace()` / `router.push()` para levar o usuário ao login ou ao início.
* Toda chamada ao servidor passa por `src/services/api.ts`. Nenhuma tela chama `fetch` diretamente.
* O servidor continua em Node.js (Express) com os dados **em memória**. Não troque por banco de dados.
* O projeto deve rodar com os mesmos dois comandos da aula (`npm start` no servidor, `npx expo start` no app).

## 4. Requisitos

### 4.1 Sessão expirada (`401`) — app

Hoje, se o token deixa de valer (o servidor foi reiniciado, por exemplo), as telas de anotações e de administração só mostram a mensagem de erro e o usuário fica preso em um app "logado" que não consegue fazer nada.

* Quando qualquer requisição autenticada receber **`401`**, o app deve chamar `sair()` e voltar ao login **sozinho**, sem navegação explícita.
* Isso vale, no mínimo, para as telas de anotações, administração e perfil (*Conferir token no servidor*), e para as telas criadas neste trabalho.
* **`403` não é `401`.** Um `403` (sem permissão) deve continuar mostrando a mensagem de erro, sem deslogar.
* Evite copiar o mesmo `if (e.status === 401)` em cada tela. Centralize o tratamento (no contexto, em um *hook* próprio ou em outra solução) e explique no `README.md` onde ele ficou.
* O login deve exibir um aviso de que a sessão expirou (ex.: "Sua sessão expirou. Entre novamente."), diferente do logout voluntário.

### 4.2 Estado `carregando` no contexto — app

* Adicione `carregando` ao valor do `AuthContext`, verdadeiro enquanto um login ou cadastro está em andamento.
* Enquanto `carregando` for verdadeiro, mostre uma **tela de espera** (indicador de atividade e uma mensagem), em vez de só desabilitar o botão.
* Se o login falhar, a mensagem de erro **continua aparecendo** na tela de login. Atenção: se a tela de login sair da árvore enquanto espera, o estado local dela (inclusive o erro) se perde. Decida como evitar isso e justifique no `README.md`.

### 4.3 Detalhes da anotação: `/anotacoes/[id]` — app e servidor

* **Servidor:** crie a rota `GET /anotacoes/:id`. Ela responde `401` sem token válido e **`404` quando a anotação não existe ou pertence a outra pessoa** (não revele que a anotação de outro usuário existe).
* **App:** crie a rota dinâmica `/anotacoes/[id]`, aberta ao tocar em um item da lista de anotações, passando o `id` por parâmetro.
* A tela busca a anotação no servidor pelo `id` (não basta repassar o texto pela navegação) e trata os três estados: carregando, erro (incluindo `404`) e sucesso.
* Exiba o texto e a data de criação formatada (ex.: `29/09/2026 às 14:32`).
* A rota deve ficar dentro do grupo `(app)`. Responda no `README.md`: **por quê?** O que aconteceria se ela fosse criada fora dele?

> Dica: para ter `/anotacoes` e `/anotacoes/[id]` ao mesmo tempo, a tela atual `anotacoes.tsx` passa a ser `anotacoes/index.tsx`.

### 4.4 Papel `moderador` — app e servidor

* **Servidor:** acrescente o papel `moderador` e uma conta de teste `moderador@ifrs.edu.br` / `mod123`, criada ao subir o servidor e listada em `GET /`.
* **Servidor:** crie a rota `GET /moderacao/anotacoes`, que devolve **todas** as anotações de todos os usuários com o nome do autor. Só `moderador` e `admin` podem acessá-la; `usuario` recebe `403`. Prefira um *middleware* reutilizável (ex.: `somentePapeis('moderador', 'admin')`) a duplicar o `somenteAdmin`.
* **App:** crie a tela `/moderacao`, protegida por `Stack.Protected` para `moderador` e `admin`, e um link para ela no início que só aparece para esses papéis.
* `/admin` continua exclusivo do `admin`.
* No `README.md`, **liste todos os arquivos que precisaram mudar** para acrescentar o papel, com uma linha explicando o motivo de cada um.

### 4.5 Sessão que sobrevive ao *reload* — app

* Guarde a sessão com **AsyncStorage** (`npx expo install @react-native-async-storage/async-storage`) ao entrar ou cadastrar, e apague ao sair (inclusive na saída por `401` do requisito 4.1).
* Ao abrir o app, o `AuthProvider` lê o token salvo e o confere no servidor com `GET /auth/me`:
  * token válido → o usuário entra direto no app;
  * `401` → o token salvo é descartado e o login aparece;
  * nenhum token salvo → o login aparece.
* Enquanto a sessão está sendo restaurada, mostre a tela de espera. **O login não pode "piscar"** antes de o app decidir para onde ir.
* Defina e documente no `README.md` o que acontece quando o servidor está fora do ar na abertura do app (erro de conexão, status `0`).

### 4.6 Análise: funções recriadas a cada render — `README.md`

O `AuthProvider` cria `entrar`, `cadastrar` e `sair` de novo a cada renderização, e com elas um novo objeto `value`. Responda no `README.md`, em até uma página:

* Por que isso *poderia* ser um problema em um contexto (quem re-renderiza quando o `value` muda)?
* Isso é um problema **neste** projeto? Relacione com a opção `reactCompiler` do `app.json`.
* Como o problema seria resolvido sem o React Compiler (`useCallback`, `useMemo`)?
* Apresente alguma evidência: um `console.log` em um leitor do contexto, o *Profiler* do React DevTools, ou um teste desligando o `reactCompiler`.

## 5. Componentização e Organização

* Mantenha a separação do projeto da aula: telas em `src/app/`, componentes em `src/components/`, contexto em `src/contexts/`, chamadas ao servidor em `src/services/`, tipos em `src/models/`.
* Elementos novos com identidade própria viram componentes (ex.: `TelaDeEspera`, `AnotacaoDetalhe`, `AnotacaoModeracaoItem`).
* No servidor, regras de acesso ficam em *middlewares*; acesso aos dados fica em `banco.js`.

## 6. Uso de TypeScript

* Atualize os tipos em `src/models/` (ex.: `Papel` com `'moderador'`, o tipo da anotação com autor).
* O valor do contexto (`AuthContextValue`) deve refletir os campos novos.
* O uso de `any` para contornar a tipagem será penalizado. Em `catch`, use `instanceof ApiError` para acessar o `status`.

## 7. Restrições

Estão **fora do escopo** (não implemente): banco de dados real, JWT, *refresh token*, recuperação de senha, login social, bibliotecas de estado global e publicação em lojas.

> O AsyncStorage não é criptografado. Em um app real, o token iria para o `expo-secure-store`. Aqui o AsyncStorage é usado porque também funciona na web e é o assunto da aula de persistência.

## 8. Entrega

Envie o projeto (repositório Git ou `.zip` **sem** `node_modules`, nem na raiz nem em `server/`) contendo o código-fonte completo e um `README.md` com:

1. nome do aluno;
2. instruções de execução (servidor e app) e as contas de teste, incluindo a de moderador;
3. para cada requisito da seção 4, um parágrafo dizendo o que foi feito e em quais arquivos;
4. as respostas pedidas nos requisitos 4.2 (erro do login), 4.3 (por que dentro de `(app)`), 4.4 (lista de arquivos alterados), 4.5 (servidor fora do ar) e 4.6 (análise);
5. screenshots: tela de espera, detalhe de uma anotação, tela de moderação e o aviso de sessão expirada no login;
6. a tabela de rotas do servidor atualizada;
7. o link do vídeo da seção 10.

## 9. Uso de Inteligência Artificial

O uso de ferramentas de IA é **permitido como apoio**: esclarecer dúvidas, identificar erros, consultar documentação, compreender APIs e componentes e obter pequenas sugestões.

O aluno permanece **integralmente responsável pelo código entregue** e deve ser capaz de explicá-lo, como pedido no vídeo da seção 10.

## 10. Vídeo de Explicação

Não haverá apresentação online nem presencial. No lugar dela, o aluno grava **um vídeo de até 10 minutos** respondendo às três perguntas abaixo, **nesta ordem**. O vídeo deve mostrar o código e o app (e o terminal do servidor) rodando, com a voz do aluno explicando. Envie o link (YouTube não listado, Google Drive ou equivalente, com acesso liberado ao professor) no `README.md`.

**Pergunta 1 — O caminho de um login.**
Entre com a conta da Ana e explique, mostrando o código, tudo o que acontece desde o toque em *Entrar* até a tela inicial aparecer: a tela, o `entrar()` do contexto, o `api.ts`, a rota do servidor, a tela de espera e a troca de rotas pelo `Stack.Protected`. Por que nenhuma linha chama `router.replace()`?

**Pergunta 2 — A sessão que expira e a sessão que volta.**
Com o app logado, reinicie o servidor e faça uma ação autenticada: mostre o app voltando ao login com o aviso e explique onde o `401` é tratado. Depois entre de novo, recarregue o app e explique como a sessão é restaurada pelo AsyncStorage e pelo `GET /auth/me`, e por que o login não aparece por um instante.

**Pergunta 3 — O que o app esconde e o que o servidor bloqueia.**
Mostre o que a Ana, a moderadora e o admin enxergam no app. Em seguida, com o token da Ana, chame `GET /moderacao/anotacoes` **fora do app** (`curl`, Postman ou similar) e mostre o `403`. Explique a diferença entre `401` e `403` e por que o guard do app, sozinho, não protege nada.

O vídeo é obrigatório e é por ele que se avalia o domínio do código entregue. **Respostas que demonstrem desconhecimento substancial do código reduzem a nota, podendo zerá-la.**

## 11. Critérios de Avaliação

| # | Critério | Pontos |
| --- | --- | ---: |
| 1 | Sessão expirada: `401` desloga sozinho, tratamento centralizado, `403` preservado, aviso no login | 1,5 |
| 2 | `carregando` no contexto, tela de espera e erro do login preservado | 1,5 |
| 3 | `/anotacoes/[id]`: rota no servidor com `404` para anotação alheia, tela com parâmetro e três estados | 2,0 |
| 4 | Papel `moderador`: conta de teste, *middleware*, rota no servidor, guard e link no app, lista de arquivos | 2,0 |
| 5 | Sessão persistida: gravação, restauração com `GET /auth/me`, descarte em `401`, sem "piscar" o login | 1,5 |
| 6 | Análise das funções recriadas, com evidência | 0,5 |
| 7 | TypeScript, componentização e organização (app e servidor) | 0,5 |
| 8 | Entrega completa: `README.md`, respostas, screenshots e instruções | 0,5 |
| | **Total** | **10,0** |

### Penalidades

| Situação | Efeito |
| --- | ---: |
| Projeto não executa (app ou servidor com erro ao iniciar) | nota 0,0 até correção |
| Implementação copiada integralmente de projeto pronto/terceiros | nota 0,0 |
| Vídeo ausente, inacessível ou que não responde às três perguntas | até −10,0 |
| Desconhecimento substancial do código demonstrado no vídeo | até −10,0 |
| Navegação manual (`router.replace`/`push`) para login/início em vez de guard | −1,0 |
| Proteção feita só no app (rota do servidor acessível sem o papel certo) | −1,0 |
| `fetch` chamado diretamente em telas ou no contexto | −0,5 |
| Uso excessivo de `any` ou ausência de tipagem | −1,0 |
| `README.md` ausente ou sem as respostas pedidas | −0,5 |

## 12. Checklist de Entrega

Antes de enviar, confirme:

* [ ] O servidor sobe com `npm install && npm start` em `server/` e lista as três contas de teste.
* [ ] O app inicia com `npm install && npx expo start` em uma máquina limpa.
* [ ] Reiniciar o servidor com o app logado e tocar em qualquer ação autenticada leva ao login, com aviso.
* [ ] Um `403` mostra a mensagem e **não** desloga.
* [ ] O login mostra a tela de espera, e o erro de senha errada continua aparecendo.
* [ ] Tocar em uma anotação abre `/anotacoes/[id]`; o `id` de uma anotação de outra pessoa dá `404`.
* [ ] A moderadora vê `/moderacao` mas não `/admin`; a Ana não vê nenhuma das duas; o admin vê as duas.
* [ ] `GET /moderacao/anotacoes` com o token da Ana responde `403`.
* [ ] Recarregar o app logado mantém a sessão, sem mostrar o login por um instante.
* [ ] Sair e recarregar volta ao login.
* [ ] Nenhuma tela chama `router.replace()` depois de login/logout.
* [ ] `README.md` com todas as respostas e screenshots.
* [ ] `node_modules` não está no envio (nem em `server/`).
* [ ] O vídeo tem até 10 minutos, responde às três perguntas e o link está acessível ao professor.
* [ ] Sei explicar cada arquivo do projeto.
