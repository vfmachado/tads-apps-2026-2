import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Chip } from '@/components/chip';
import { Header } from '@/components/header';
import { Note } from '@/components/note';
import { TarefaItem } from '@/components/tarefa-item';
import { Colors, Spacing } from '@/constants/theme';
import { CATEGORIAS, TAREFAS } from '@/models/tarefa';

export default function ScrollViewScreen() {
  return (
    // ScrollView tem DUAS props de estilo, e confundi-las é o erro mais comum:
    //   style              -> o retângulo que rola (aqui: ocupa a tela inteira).
    //   contentContainerStyle -> o conteúdo DE DENTRO (padding, gap, alinhamento).
    // padding em `style` corta o conteúdo; gap em `style` não faz nada.
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Header
        title="ScrollView"
        subtitle="Um contêiner que rola. Nada mais — e nada menos."
      />

      <Note>
        A View comum não rola: o que passa da tela some. O ScrollView é a View que rola. Ele
        renderiza TODOS os filhos de uma vez, mesmo os que estão fora da tela.
      </Note>

      {/* ScrollView horizontal: mesma ideia, outro eixo.
          O filho direto é uma linha; horizontal={true} + showsHorizontalScrollIndicator. */}
      <View style={styles.bloco}>
        <Text style={styles.blocoTitulo}>ScrollView horizontal</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.linha}>
          {CATEGORIAS.map((categoria) => (
            <Chip key={categoria} label={categoria} />
          ))}
          <Chip label="Sem categoria" />
        </ScrollView>
      </View>

      {/* Lista feita "na mão" com .map().
          Repare no `key`: em JSX, todo elemento criado dentro de um .map() precisa de uma
          chave estável. É exatamente o mesmo papel do keyExtractor da FlatList (tela 3). */}
      <View style={styles.bloco}>
        <Text style={styles.blocoTitulo}>Lista com .map()</Text>
        <View style={styles.itens}>
          {TAREFAS.map((tarefa) => (
            <TarefaItem key={tarefa.id} tarefa={tarefa} />
          ))}
        </View>
      </View>

      <Note>
        Use ScrollView quando o conteúdo é pequeno e conhecido: um formulário, uma tela de
        detalhes, um carrossel de poucos itens. Para listas longas ou vindas de uma API, use
        FlatList — a próxima tela.
      </Note>

      <Note>
        Cuidado: não coloque uma FlatList vertical dentro de um ScrollView vertical. Os dois
        disputam a rolagem, e a FlatList perde a capacidade de renderizar sob demanda.
      </Note>
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
    paddingBottom: Spacing.xl,
  },
  bloco: {
    gap: Spacing.sm,
  },
  blocoTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  linha: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  itens: {
    gap: Spacing.sm,
  },
});
