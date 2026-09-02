import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { Header } from '@/components/header';
import { Note } from '@/components/note';
import { PrimaryButton } from '@/components/primary-button';
import { RotaAtual } from '@/components/rota-atual';
import { TarefaItem } from '@/components/tarefa-item';
import { Colors, Spacing } from '@/constants/theme';
import { tarefasDaCategoria } from '@/models/tarefa';

// TELA 5 — src/app/categoria/[nome].tsx  ->  "/categoria/Estudo?ordem=za"
//
// Dois tipos de parâmetro convivem na mesma rota:
//
//   nome  -> vem do CAMINHO (segmento dinâmico [nome]); identifica a tela.
//   ordem -> vem da QUERY (?ordem=za); é um detalhe de exibição, opcional.
//
// A regra prática: o que define O QUE a tela mostra vai no caminho; o que
// define COMO ela mostra pode ir na query.
export default function CategoriaScreen() {
  const { nome, ordem } = useLocalSearchParams<{ nome: string; ordem?: string }>();
  const router = useRouter();

  const decrescente = ordem === 'za';

  // Lista derivada: nada de novo useState. `sort` muda o array original,
  // por isso ordenamos uma CÓPIA ([...]) — mesma regra da Aula 4.
  const tarefas = [...tarefasDaCategoria(nome)].sort((a, b) =>
    decrescente ? b.titulo.localeCompare(a.titulo) : a.titulo.localeCompare(b.titulo)
  );

  return (
    <FlatList
      style={styles.tela}
      contentContainerStyle={styles.conteudo}
      data={tarefas}
      keyExtractor={(tarefa) => tarefa.id}
      ListHeaderComponent={
        <View style={styles.cabecalho}>
          <Stack.Screen options={{ title: nome ?? 'Categoria' }} />

          <Header
            title={nome ?? 'Categoria'}
            subtitle={`${tarefas.length} tarefa(s) · ordem ${decrescente ? 'Z→A' : 'A→Z'}`}
          />

          <Note>
            O botão abaixo não navega para outra tela: router.setParams() troca
            só a query da rota atual. Repare na URL em usePathname/params.
          </Note>

          <PrimaryButton
            label={decrescente ? 'Ordenar A→Z' : 'Ordenar Z→A'}
            variant="secondary"
            onPress={() => router.setParams({ ordem: decrescente ? 'az' : 'za' })}
          />

          <RotaAtual />
        </View>
      }
      renderItem={({ item }) => (
        <TarefaItem
          tarefa={item}
          onPress={() => router.push({ pathname: '/tarefa/[id]', params: { id: item.id } })}
        />
      )}
      ItemSeparatorComponent={() => <View style={styles.separador} />}
      ListEmptyComponent={
        <EmptyState
          titulo="Categoria vazia"
          descricao={`Nenhuma tarefa em "${nome}". Tente Estudo, Casa, Trabalho ou Pessoal.`}
        />
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
});
