import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';

import { Header } from '@/components/header';
import { Note } from '@/components/note';
import { PrimaryButton } from '@/components/primary-button';
import { TarefaItem } from '@/components/tarefa-item';
import { Colors, Spacing } from '@/constants/theme';
import { TAREFAS } from '@/models/tarefa';

// TELA 1 — src/app/(tabs)/index.tsx  ->  rota "/"
//
// Listagem. Cada item leva para os detalhes usando navegação PROGRAMÁTICA:
// o toque chama router.push(). Compare com a tela Explorar, que faz o mesmo
// caminho de forma declarativa, com <Link>.
export default function TarefasScreen() {
  // useRouter() devolve o mesmo objeto do `router` importado direto do
  // expo-router. Dentro de componentes, prefira o hook.
  const router = useRouter();

  return (
    <FlatList
      style={styles.tela}
      contentContainerStyle={styles.conteudo}
      data={TAREFAS}
      keyExtractor={(tarefa) => tarefa.id}
      // ListHeaderComponent recebe um ELEMENTO, não uma função (Aula 4).
      ListHeaderComponent={
        <View style={styles.cabecalho}>
          <Header title="Minhas tarefas" subtitle="Toque em uma tarefa para ver os detalhes" />
          <Note>
            O toque chama router.push() com o ID da tarefa. O objeto NÃO viaja
            entre as telas: viaja o identificador, e a tela de destino busca os
            dados.
          </Note>
        </View>
      }
      renderItem={({ item }) => (
        <TarefaItem
          tarefa={item}
          onPress={() =>
            // Forma de objeto: pathname é o nome do ARQUIVO da rota
            // (com o [id] literal), e params preenche o segmento dinâmico.
            router.push({ pathname: '/tarefa/[id]', params: { id: item.id } })
          }
        />
      )}
      ItemSeparatorComponent={() => <View style={styles.separador} />}
      ListFooterComponent={
        <View style={styles.rodape}>
          <PrimaryButton
            label="Abrir uma tarefa que não existe"
            variant="secondary"
            // A ROTA existe (/tarefa/[id]); o dado é que não existe.
            // Quem trata isso é a tela de detalhes, não o roteador.
            onPress={() => router.push({ pathname: '/tarefa/[id]', params: { id: 't999' } })}
          />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  conteudo: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  cabecalho: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  separador: {
    height: Spacing.sm,
  },
  rodape: {
    marginTop: Spacing.lg,
  },
});
