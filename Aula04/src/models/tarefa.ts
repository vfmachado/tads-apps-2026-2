// Modelo dos itens que vamos listar na Aula 4.
// Repare no `id`: ele é o que permite usar um keyExtractor confiável.

export type Categoria = 'Estudo' | 'Casa' | 'Trabalho' | 'Pessoal';

export interface Tarefa {
  id: string;
  titulo: string;
  categoria: Categoria;
  concluida: boolean;
}

export const TAREFAS: Tarefa[] = [
  { id: 't1', titulo: 'Ler o capítulo sobre listas', categoria: 'Estudo', concluida: true },
  { id: 't2', titulo: 'Entregar o Trabalho I', categoria: 'Estudo', concluida: false },
  { id: 't3', titulo: 'Revisar o formulário da Aula 3', categoria: 'Estudo', concluida: false },
  { id: 't4', titulo: 'Comprar café', categoria: 'Casa', concluida: false },
  { id: 't5', titulo: 'Lavar a louça', categoria: 'Casa', concluida: true },
  { id: 't6', titulo: 'Responder e-mails do estágio', categoria: 'Trabalho', concluida: false },
  { id: 't7', titulo: 'Preparar a apresentação', categoria: 'Trabalho', concluida: false },
  { id: 't8', titulo: 'Marcar o dentista', categoria: 'Pessoal', concluida: false },
  { id: 't9', titulo: 'Correr 5 km', categoria: 'Pessoal', concluida: true },
  { id: 't10', titulo: 'Organizar as fotos da viagem', categoria: 'Pessoal', concluida: false },
];

export const CATEGORIAS: Categoria[] = ['Estudo', 'Casa', 'Trabalho', 'Pessoal'];

// Usada na tela de desempenho: gera muitos itens sem precisar digitá-los.
export function gerarTarefas(quantidade: number): Tarefa[] {
  return Array.from({ length: quantidade }, (_, indice) => ({
    id: `gerada-${indice}`,
    titulo: `Tarefa número ${indice + 1}`,
    categoria: CATEGORIAS[indice % CATEGORIAS.length],
    concluida: indice % 3 === 0,
  }));
}

// Gera um id único para itens criados em tempo de execução.
// (Em um app real viria do banco de dados ou de uma biblioteca como uuid.)
export function novoId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
