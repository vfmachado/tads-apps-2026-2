import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Chip } from '@/components/chip';
import { EmptyState } from '@/components/empty-state';
import { Header } from '@/components/header';
import { Note } from '@/components/note';
import { PrimaryButton } from '@/components/primary-button';
import { TarefaItem } from '@/components/tarefa-item';
import { TextField } from '@/components/text-field';
import { Colors, Spacing } from '@/constants/theme';
import { CATEGORIAS, TAREFAS, novoId, type Categoria, type Tarefa } from '@/models/tarefa';

export default function ListaTarefasScreen() {
  const [tarefas, setTarefas] = useState<Tarefa[]>(TAREFAS);
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [atualizando, setAtualizando] = useState(false);

  // ESTADO DERIVADO (Aula 3): a lista filtrada não é um useState.
  // Ela é calculada a cada renderização a partir do estado que existe.
  const visiveis = tarefas.filter((tarefa) => {
    const combinaTexto = tarefa.titulo.toLowerCase().includes(busca.trim().toLowerCase());
    const combinaCategoria = categoria === null || tarefa.categoria === categoria;
    return combinaTexto && combinaCategoria;
  });

  const concluidas = tarefas.filter((tarefa) => tarefa.concluida).length;

  // IMUTABILIDADE (Aula 3): map devolve um array NOVO com um objeto NOVO no lugar
  // do alterado. Alterar `tarefa.concluida = !tarefa.concluida` não redesenharia nada.
  function alternarConclusao(id: string) {
    setTarefas((anteriores) =>
      anteriores.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
      )
    );
  }

  function remover(id: string) {
    setTarefas((anteriores) => anteriores.filter((tarefa) => tarefa.id !== id));
  }

  function adicionar() {
    const titulo = novaTarefa.trim();
    if (titulo === '') return;

    // Item novo entra com id próprio — é ele que o keyExtractor vai usar.
    const tarefa: Tarefa = {
      id: novoId(),
      titulo,
      categoria: categoria ?? 'Pessoal',
      concluida: false,
    };

    setTarefas((anteriores) => [tarefa, ...anteriores]);
    setNovaTarefa('');
  }

  // Simula uma recarga vinda de uma API (Aula 10 fará isso de verdade).
  function recarregar() {
    setAtualizando(true);
    setTimeout(() => {
      setTarefas(TAREFAS);
      setAtualizando(false);
    }, 1200);
  }

  return (
    <FlatList
      data={visiveis}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TarefaItem
          tarefa={item}
          onPress={() => alternarConclusao(item.id)}
          onLongPress={() => remover(item.id)}
        />
      )}
      style={styles.screen}
      contentContainerStyle={styles.container}
      // ATENÇÃO: passamos um ELEMENTO (<View>...</View>), não uma função.
      // Com ListHeaderComponent={() => <View/>} o React vê um componente novo a cada
      // renderização, remonta o cabeçalho e o TextInput perde o foco a cada tecla.
      ListHeaderComponent={
        <View style={styles.cabecalho}>
          <Header title="Lista de tarefas" subtitle="A FlatList completa, com tudo em volta" />

          <View style={styles.formulario}>
            <View style={styles.campo}>
              <TextField
                label="Nova tarefa"
                placeholder="O que precisa ser feito?"
                value={novaTarefa}
                onChangeText={setNovaTarefa}
                onSubmitEditing={adicionar}
                returnKeyType="done"
              />
            </View>
            <PrimaryButton label="Adicionar" onPress={adicionar} disabled={novaTarefa.trim() === ''} />
          </View>

          <TextField
            label="Buscar"
            placeholder="Filtrar pelo título"
            value={busca}
            onChangeText={setBusca}
          />

          <View style={styles.filtros}>
            <Chip label="Todas" selected={categoria === null} onPress={() => setCategoria(null)} />
            {CATEGORIAS.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={categoria === item}
                onPress={() => setCategoria(categoria === item ? null : item)}
              />
            ))}
          </View>

          <Note>
            Toque para concluir, segure para remover. Puxe a lista para baixo para recarregar.
          </Note>
        </View>
      }
      ItemSeparatorComponent={() => <View style={styles.separador} />}
      // Aparece sozinho quando `data` fica vazia — sem nenhum `if` na tela.
      ListEmptyComponent={
        <EmptyState
          titulo="Nada por aqui"
          descricao="Nenhuma tarefa corresponde à busca e ao filtro atuais."
        />
      }
      ListFooterComponent={
        <Text style={styles.rodape}>
          {visiveis.length} de {tarefas.length} tarefas · {concluidas} concluídas
        </Text>
      }
      // Pull-to-refresh pronto: basta um booleano e uma função.
      refreshing={atualizando}
      onRefresh={recarregar}
      // Esconde o teclado quando o usuário começa a rolar a lista.
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  cabecalho: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  formulario: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  campo: {
    flex: 1,
  },
  filtros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  separador: {
    height: Spacing.sm,
  },
  rodape: {
    marginTop: Spacing.md,
    textAlign: 'center',
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
