// Modelo dos dados que as telas da Aula 5 exibem.
// A navegação NÃO carrega objetos: ela carrega o `id`. Quem tem o objeto é
// este módulo — a tela de detalhes recebe o id e busca a tarefa aqui.

export type Categoria = 'Estudo' | 'Casa' | 'Trabalho' | 'Pessoal';

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  categoria: Categoria;
  concluida: boolean;
  prazo: string;
}

export const CATEGORIAS: Categoria[] = ['Estudo', 'Casa', 'Trabalho', 'Pessoal'];

export const TAREFAS: Tarefa[] = [
  {
    id: 't1',
    titulo: 'Ler o capítulo sobre navegação',
    descricao: 'Rotas baseadas em arquivos, Stack e Tabs. Anotar as dúvidas para a próxima aula.',
    categoria: 'Estudo',
    concluida: true,
    prazo: '02/09',
  },
  {
    id: 't2',
    titulo: 'Entregar o Trabalho I',
    descricao: 'Subir o projeto no repositório da turma antes das 23h59.',
    categoria: 'Estudo',
    concluida: false,
    prazo: '05/09',
  },
  {
    id: 't3',
    titulo: 'Refazer a lista da Aula 4',
    descricao: 'Trocar o ScrollView por FlatList e conferir o keyExtractor.',
    categoria: 'Estudo',
    concluida: false,
    prazo: '06/09',
  },
  {
    id: 't4',
    titulo: 'Comprar café',
    descricao: 'Moído, pacote de 500 g.',
    categoria: 'Casa',
    concluida: false,
    prazo: '03/09',
  },
  {
    id: 't5',
    titulo: 'Consertar a torneira',
    descricao: 'Trocar o reparo da pia da cozinha.',
    categoria: 'Casa',
    concluida: true,
    prazo: '01/09',
  },
  {
    id: 't6',
    titulo: 'Responder e-mails do estágio',
    descricao: 'Confirmar o horário da reunião de sexta.',
    categoria: 'Trabalho',
    concluida: false,
    prazo: '02/09',
  },
  {
    id: 't7',
    titulo: 'Preparar a apresentação',
    descricao: 'Cinco slides sobre o andamento do projeto.',
    categoria: 'Trabalho',
    concluida: false,
    prazo: '08/09',
  },
  {
    id: 't8',
    titulo: 'Marcar o dentista',
    descricao: 'Revisão semestral.',
    categoria: 'Pessoal',
    concluida: false,
    prazo: '10/09',
  },
  {
    id: 't9',
    titulo: 'Correr 5 km',
    descricao: 'Parque, no fim da tarde.',
    categoria: 'Pessoal',
    concluida: true,
    prazo: '01/09',
  },
  {
    id: 't10',
    titulo: 'Organizar as fotos da viagem',
    descricao: 'Separar as melhores e apagar as repetidas.',
    categoria: 'Pessoal',
    concluida: false,
    prazo: '15/09',
  },
];

// Busca por id — é isto que a tela de detalhes faz com o parâmetro da rota.
// Devolve `undefined` quando o id não existe: a tela precisa tratar esse caso.
export function buscarTarefa(id: string | undefined): Tarefa | undefined {
  return TAREFAS.find((tarefa) => tarefa.id === id);
}

export function tarefasDaCategoria(categoria: string | undefined): Tarefa[] {
  return TAREFAS.filter((tarefa) => tarefa.categoria === categoria);
}

export function contarPorCategoria(categoria: Categoria): number {
  return tarefasDaCategoria(categoria).length;
}

// Usada na tela de detalhes para o botão "próxima tarefa".
export function proximaTarefa(id: string | undefined): Tarefa {
  const indice = TAREFAS.findIndex((tarefa) => tarefa.id === id);
  return TAREFAS[(indice + 1) % TAREFAS.length];
}

export function ehCategoria(valor: string | undefined): valor is Categoria {
  return CATEGORIAS.includes(valor as Categoria);
}
