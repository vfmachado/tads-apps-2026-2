import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { Header } from '@/components/header';
import { Note } from '@/components/note';
import { PrimaryButton } from '@/components/primary-button';
import { RotaAtual } from '@/components/rota-atual';
import { Colors, Spacing } from '@/constants/theme';
import { buscarTarefa, proximaTarefa } from '@/models/tarefa';

// TELA 4 — src/app/tarefa/[id].tsx  ->  rota "/tarefa/t3"
//
// Os colchetes no nome do arquivo criam um SEGMENTO DINÂMICO: qualquer valor
// no lugar de [id] cai nesta tela, e o valor chega em useLocalSearchParams().
//
// Parâmetro de rota é sempre STRING. Se você mandar um número, ele volta
// como texto ("3", não 3).
export default function DetalhesTarefaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const tarefa = buscarTarefa(id);

  // A rota existe mesmo quando o dado não existe: tratar isso é da tela.
  if (!tarefa) {
    return (
      <View style={styles.centro}>
        <Stack.Screen options={{ title: 'Tarefa não encontrada' }} />
        <EmptyState
          titulo="Não encontramos essa tarefa"
          descricao={`Nenhuma tarefa com o id "${id}".`}
        />
        <PrimaryButton label="Voltar para a lista" onPress={() => router.dismissTo('/')} />
      </View>
    );
  }

  const seguinte = proximaTarefa(tarefa.id);

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      {/* Opções calculadas em tempo de execução: o título do cabeçalho sai
          do dado carregado. Isto sobrescreve o title definido no _layout. */}
      <Stack.Screen options={{ title: tarefa.titulo }} />

      <Header title={tarefa.titulo} subtitle={`${tarefa.categoria} · até ${tarefa.prazo}`} />

      <View style={styles.cartao}>
        <Text style={styles.descricao}>{tarefa.descricao}</Text>
        <Text style={styles.status}>
          {tarefa.concluida ? '✓ Concluída' : '○ Em aberto'}
        </Text>
      </View>

      <Note>
        A tela recebeu apenas o id. Os dados vieram de buscarTarefa(id), em
        src/models/tarefa.ts — é assim que se faz também quando os dados vêm
        de uma API.
      </Note>

      <RotaAtual />

      <View style={styles.acoes}>
        <PrimaryButton
          label={`Ver categoria "${tarefa.categoria}"`}
          onPress={() =>
            router.push({ pathname: '/categoria/[nome]', params: { nome: tarefa.categoria } })
          }
        />
        <PrimaryButton
          label="Próxima tarefa (push)"
          variant="secondary"
          // push EMPILHA outra tela de detalhes: o botão voltar traz esta
          // de volta. Toque várias vezes e conte os "voltar" necessários.
          onPress={() => router.push({ pathname: '/tarefa/[id]', params: { id: seguinte.id } })}
        />
        <PrimaryButton
          label="Próxima tarefa (replace)"
          variant="secondary"
          // replace TROCA a tela atual: a pilha não cresce e o voltar leva
          // direto para a listagem.
          onPress={() => router.replace({ pathname: '/tarefa/[id]', params: { id: seguinte.id } })}
        />
        <PrimaryButton
          label="Voltar"
          variant="secondary"
          // canGoBack() evita chamar back() quando não há para onde voltar
          // (por exemplo, ao abrir o app direto neste link).
          disabled={!router.canGoBack()}
          onPress={() => router.back()}
        />
        <PrimaryButton
          label="Voltar para a lista (dismissTo)"
          variant="secondary"
          // Fecha quantas telas forem necessárias até chegar em "/".
          onPress={() => router.dismissTo('/')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  conteudo: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },
  cartao: {
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  descricao: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text,
  },
  status: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  acoes: {
    gap: Spacing.sm,
  },
});
