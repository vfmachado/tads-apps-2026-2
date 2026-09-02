import { ScrollView, StyleSheet, View } from 'react-native';

import { Header } from '@/components/header';
import { MenuLink } from '@/components/menu-link';
import { Note } from '@/components/note';
import { Colors, Spacing } from '@/constants/theme';

export default function MenuScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Header
        title="Listas"
        subtitle="ScrollView, FlatList e a importância da chave de cada item"
      />

      <Note>
        Toda tela deste projeto mostra os MESMOS dados (src/models/tarefa.ts). O que muda é
        COMO eles chegam à tela.
      </Note>

      <View style={styles.list}>
        <MenuLink
          href="/scroll-view"
          step="1"
          title="ScrollView"
          description="Rolagem de conteúdo com .map() — tudo é renderizado de uma vez."
        />
        <MenuLink
          href="/flat-list"
          step="2"
          title="FlatList"
          description="data, renderItem e keyExtractor: a lista que renderiza sob demanda."
        />
        <MenuLink
          href="/chaves"
          step="3"
          title="keyExtractor"
          description="Por que o índice como chave quebra a lista — demonstração lado a lado."
        />
        <MenuLink
          href="/lista-tarefas"
          step="4"
          title="Lista completa"
          description="Cabeçalho, separador, lista vazia, busca, filtro e pull-to-refresh."
        />
        <MenuLink
          href="/desempenho"
          step="5"
          title="Desempenho"
          description="600 itens nas duas abordagens — conte quantos são realmente criados."
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  list: {
    gap: Spacing.sm,
  },
});
