import { FlatList, StyleSheet, Text, View, type ListRenderItemInfo } from 'react-native';

import { Header } from '@/components/header';
import { Note } from '@/components/note';
import { TarefaItem } from '@/components/tarefa-item';
import { Colors, Spacing } from '@/constants/theme';
import { TAREFAS, type Tarefa } from '@/models/tarefa';

export default function FlatListScreen() {
  // renderItem recebe um OBJETO, não o item direto.
  // Por isso a desestruturação { item } — os outros campos são `index` e `separators`.
  function renderizarItem({ item, index }: ListRenderItemInfo<Tarefa>) {
    return (
      <View style={styles.linha}>
        <Text style={styles.indice}>{index}</Text>
        <View style={styles.item}>
          <TarefaItem tarefa={item} />
        </View>
      </View>
    );
  }

  return (
    <FlatList
      // 1. OS DADOS: um array. A FlatList não sabe (nem precisa saber) de onde ele veio.
      data={TAREFAS}
      // 2. COMO DESENHAR UM ITEM: uma função chamada uma vez por item visível.
      renderItem={renderizarItem}
      // 3. A IDENTIDADE DE CADA ITEM: uma string única e estável. Detalhes na tela 3.
      keyExtractor={(item) => item.id}
      // O ScrollView tem style/contentContainerStyle; a FlatList também — ela É um ScrollView
      // por baixo, com a renderização sob demanda por cima.
      style={styles.screen}
      contentContainerStyle={styles.container}
      // Cabeçalho e rodapé rolam JUNTO com a lista (não ficam fixos).
      ListHeaderComponent={
        <View style={styles.cabecalho}>
          <Header
            title="FlatList"
            subtitle="A lista que só renderiza o que está na tela"
          />
          <Note>
            São três props obrigatórias na prática: data (o array), renderItem (como desenhar
            um item) e keyExtractor (o identificador de cada item).
          </Note>
        </View>
      }
      // Desenhado ENTRE dois itens — nunca antes do primeiro nem depois do último.
      ItemSeparatorComponent={() => <View style={styles.separador} />}
      ListFooterComponent={
        <Note>
          O número à esquerda é o `index` de cada item. Ele serve para saber a POSIÇÃO — nunca
          para identificar o item.
        </Note>
      }
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
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  indice: {
    width: 20,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  item: {
    flex: 1,
  },
  separador: {
    height: Spacing.sm,
  },
});
