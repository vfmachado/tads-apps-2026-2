# Trabalho Prático I — Reprodução de Interface Mobile

**Disciplina:** Desenvolvimento de Aplicativos · **Valor:** 10,0 pontos · **Modalidade:** individual ou dupla
**Entrega:** até 08/09/2026, pelo ambiente virtual da disciplina.

## 1. Objetivo

Avaliar a capacidade de analisar a interface de um aplicativo real, decompô-la em componentes e reimplementá-la em React Native, demonstrando domínio de componentização, navegação, estado, renderização de listas e TypeScript.

## 2. Descrição da Atividade

Escolha um aplicativo já existente e reimplemente **três telas representativas** dele com React Native. O objetivo não é recriar o aplicativo inteiro, nem produzir uma cópia *pixel-perfect*, mas reproduzir um **fluxo coerente** com organização visual e estrutural semelhante à do original.

Todo o código deve ser de autoria do aluno. Não é permitido entregar projeto pronto obtido de repositórios, tutoriais ou templates de terceiros.

## 3. Escolha do Aplicativo

Qualquer aplicativo conhecido serve como referência: e-commerce, marketplace, supermercado, delivery, notícias, rede social, streaming, financeiro, viagens, esportes ou serviços.

Exemplos: Mercado Livre, Amazon, Shopee, Instagram, LinkedIn, iFood, Spotify, Airbnb, Booking, Nubank, G1.

O aplicativo escolhido deve ser identificado no `README.md`.

## 4. Requisitos Obrigatórios

* **React Native + Expo + TypeScript**.
* Exatamente **três telas principais**, integradas por navegação.
* Pelo menos **uma listagem** gerada a partir de dados mockados.
* Pelo menos **um formulário** com múltiplos campos e estado controlado.
* **Todos os dados mockados localmente** (arquivos `.ts`/`.json`, arrays de objetos, constantes).
* O aplicativo deve funcionar **sem conexão com a Internet**.

## 5. Requisitos das Três Telas

As três telas devem formar um fluxo plausível dentro do aplicativo escolhido. Exemplos:

| Categoria | Tela 1 | Tela 2 | Tela 3 |
| --- | --- | --- | --- |
| E-commerce | Lista de produtos | Detalhes do produto | Cadastro de endereço |
| Notícias | Feed de notícias | Detalhe da notícia | Busca com filtros |
| Rede social | Feed de publicações | Perfil | Criar/editar publicação |

Os exemplos são apenas referências — defina as telas conforme o aplicativo escolhido.

## 6. Listagem de Dados

* Deve ter **múltiplos itens**, originados de uma estrutura de dados (não escritos manualmente no JSX).
* Use `FlatList` (ou `SectionList`) com `keyExtractor` adequado sempre que a coleção for de tamanho variável.
* Cada item deve ser renderizado por um **componente próprio** (ex.: `ProductCard`, `NewsCard`).

> Interfaces que apenas repetem elementos semelhantes escritos à mão, sem origem em dados, **não** cumprem este requisito.

## 7. Formulário

* Pelo menos **três campos ou controles de entrada**, com componentes variados quando fizer sentido: `TextInput`, botões, seletores, `Switch`, campos numéricos, opções de seleção.
* Os campos devem ser **controlados**: o valor digitado é mantido no estado (`useState`) enquanto a tela estiver em uso.
* Deve haver uma ação de conclusão (salvar, aplicar filtros, publicar) com feedback visual — sem envio a servidor.
* Validações simples (campo obrigatório, formato) são bem-vindas, mas não obrigatórias.

## 8. Navegação

* As três telas devem estar conectadas por Expo Router (ou React Navigation), permitindo ida e volta.
* Pelo menos uma navegação deve **passar parâmetros** (ex.: o `id` do item selecionado na lista para a tela de detalhes).
* O fluxo deve ser plausível: `Lista → Detalhes → Formulário`, `Feed → Perfil → Editar Perfil`, ou equivalente.

## 9. Componentização e Organização

Nenhuma tela deve concentrar toda a interface em um único componente. Elementos reutilizáveis ou conceitualmente independentes devem virar componentes (ex.: `ProductCard`, `ProfileHeader`, `SearchBar`, `FormField`, `PriceTag`).

Evite os dois extremos: componentes gigantes e fragmentação artificial.


## 10. Uso de TypeScript

Defina tipos ou interfaces para os dados e para as *props* dos componentes:

```ts
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}
```

O uso de `any` para contornar a tipagem será penalizado.

## 11. Restrições

Estão **fora do escopo** (não implemente): backend, banco de dados, autenticação real, cadastro real de usuários, integração com APIs, pagamentos, persistência remota, publicação em lojas e a implementação completa do aplicativo escolhido.

Imagens locais, ícones e recursos do ecossistema Expo são permitidos. Imagens públicas podem ser usadas como referência visual, mas o funcionamento do aplicativo não pode depender delas.

## 12. Entrega

Envie o projeto (repositório Git ou `.zip` **sem** `node_modules`) contendo o código-fonte completo e um `README.md` com:

1. aplicativo usado como referência;
2. descrição das três telas escolhidas;
3. instruções de execução (`npm install`, `npx expo start`);
4. screenshots das três telas implementadas;
5. funcionalidades implementadas;
6. onde estão os dados mockados;
7. quais partes da interface viraram componentes reutilizáveis.

## 13. Uso de Inteligência Artificial

O uso de ferramentas de IA é **permitido como apoio**: esclarecer dúvidas, identificar erros, consultar documentação, compreender APIs e componentes e obter pequenas sugestões.

O aluno permanece **integralmente responsável pelo código entregue** e deve ser capaz de explicá-lo e defendê-lo.

## 14. Apresentação e Defesa do Trabalho

Durante a avaliação, o aluno poderá ser solicitado a:

* explicar a estrutura do projeto e seus componentes;
* explicar como os dados são carregados e tipados;
* explicar o funcionamento da navegação e a passagem de parâmetros;
* explicar o gerenciamento de estado utilizado;
* realizar pequenas modificações no código ao vivo.

**O desconhecimento substancial do código entregue reduz a nota, podendo zerá-la.**

## 15. Critérios de Avaliação

| # | Critério | Pontos |
| --- | --- | ---: |
| 1 | Três telas implementadas, funcionais e coerentes com o fluxo escolhido | 2,0 |
| 2 | Listagem: origem em dados mockados, uso adequado de `FlatList`, item componentizado | 1,5 |
| 3 | Formulário: múltiplos campos, controlados por estado, com interação funcional | 1,5 |
| 4 | Componentização: decomposição coerente, componentes reutilizáveis e com *props* | 1,5 |
| 5 | Navegação: fluxo funcional entre as três telas e passagem de parâmetros | 1,0 |
| 6 | TypeScript e organização do projeto: tipos definidos, estrutura de pastas, código legível | 1,5 |
| 7 | Fidelidade estrutural ao aplicativo de referência, qualidade visual e usabilidade | 0,5 |
| 8 | Entrega completa: `README.md`, screenshots e instruções de execução | 0,5 |
| | **Total** | **10,0** |

### Penalidades

| Situação | Efeito |
| --- | ---: |
| Projeto não executa (erro ao iniciar com Expo) | nota 0,0 até correção |
| Implementação copiada integralmente de projeto pronto/terceiros | nota 0,0 |
| Desconhecimento substancial do código na defesa | até −10,0 |
| Ausência de uma das três telas | −2,0 |
| Ausência de listagem | −1,5 |
| Ausência de formulário | −1,5 |
| Ausência de componentização (tudo em um único arquivo/componente) | −1,5 |
| Dados fixados diretamente no JSX em vez de estrutura mockada | −1,0 |
| Uso excessivo de `any` ou ausência de tipagem | −1,0 |
| Dependência de API externa para funcionar | −1,0 |
| `README.md` ausente ou incompleto | −0,5 |

## 16. Checklist de Entrega

Antes de enviar, confirme:

* [ ] O projeto inicia com `npx expo start` em uma máquina limpa (`npm install` a partir do zero).
* [ ] Existem exatamente três telas principais, todas alcançáveis pela navegação.
* [ ] A navegação funciona nos dois sentidos e passa parâmetros em pelo menos um trecho.
* [ ] A listagem usa `FlatList` e vem de dados mockados com múltiplos itens.
* [ ] O formulário tem múltiplos campos controlados por estado e uma ação de conclusão.
* [ ] Há componentes reutilizáveis fora das telas, com *props* tipadas.
* [ ] Nenhum `any` desnecessário; interfaces/tipos definidos para os dados.
* [ ] Arquivos organizados em pastas (componentes, telas, dados, tipos).
* [ ] O aplicativo funciona em modo avião.
* [ ] `README.md` completo, com screenshots das três telas.
* [ ] `node_modules` não está no envio.
* [ ] Sei explicar cada arquivo do projeto.
