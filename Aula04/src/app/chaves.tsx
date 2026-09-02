import { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Header } from '@/components/header';
import { Note } from '@/components/note';
import { PrimaryButton } from '@/components/primary-button';
import { Colors, Spacing } from '@/constants/theme';
import { TAREFAS, type Tarefa } from '@/models/tarefa';

// Item com ESTADO PRÓPRIO (o destaque). É esse estado que o React precisa
// reencontrar quando a lista muda — e ele usa a chave para isso.
function ItemComEstado({ tarefa }: { tarefa: Tarefa }) {
  const [destacado, setDestacado] = useState(false);

  return (
    <Pressable
      onPress={() => setDestacado((anterior) => !anterior)}
      style={[styles.item, destacado && styles.itemDestacado]}>
      <Text style={[styles.itemTexto, destacado && styles.itemTextoDestacado]} numberOfLines={1}>
        {tarefa.titulo}
      </Text>
    </Pressable>
  );
}

export default function ChavesScreen() {
  const [tarefas, setTarefas] = useState<Tarefa[]>(TAREFAS.slice(0, 5));

  function removerPrimeira() {
    setTarefas((anteriores) => anteriores.slice(1));
  }

  function reiniciar() {
    setTarefas(TAREFAS.slice(0, 5));
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Header
        title="keyExtractor"
        subtitle="A chave diz ao React QUEM é cada item entre uma renderização e outra"
      />

      <Note>
        Experimento: toque no 3º item das duas listas para destacá-lo. Depois toque em
        "Remover a primeira". À esquerda o destaque fica parado na posição; à direita ele
        acompanha a tarefa.
      </Note>

      <View style={styles.colunas}>
        <View style={styles.coluna}>
          <Text style={styles.colunaTitulo}>Chave = índice</Text>
          <Text style={styles.colunaSub}>errado</Text>
          <FlatList
            data={tarefas}
            renderItem={({ item }) => <ItemComEstado tarefa={item} />}
            // A posição não identifica o item: ao remover o primeiro, TODOS os outros
            // mudam de índice, e o React acha que cada item virou outro.
            keyExtractor={(_item, index) => String(index)}
            ItemSeparatorComponent={() => <View style={styles.separador} />}
            // Listas curtas dentro de um ScrollView: desligamos a rolagem interna
            // para os dois não brigarem pelo gesto.
            scrollEnabled={false}
          />
        </View>

        <View style={styles.coluna}>
          <Text style={styles.colunaTitulo}>Chave = id</Text>
          <Text style={styles.colunaSubOk}>certo</Text>
          <FlatList
            data={tarefas}
            renderItem={({ item }) => <ItemComEstado tarefa={item} />}
            // O id pertence ao dado. Ele não muda quando a lista é reordenada ou filtrada.
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={styles.separador} />}
            scrollEnabled={false}
          />
        </View>
      </View>

      <View style={styles.acoes}>
        <View style={styles.acao}>
          <PrimaryButton
            label="Remover a primeira"
            onPress={removerPrimeira}
            disabled={tarefas.length === 0}
          />
        </View>
        <View style={styles.acao}>
          <PrimaryButton label="Reiniciar" variant="secondary" onPress={reiniciar} />
        </View>
      </View>

      <View style={styles.regras}>
        <Text style={styles.regrasTitulo}>Regras da chave</Text>
        <Text style={styles.regra}>• Única dentro da lista.</Text>
        <Text style={styles.regra}>• Estável: a mesma para o mesmo item, sempre.</Text>
        <Text style={styles.regra}>• String — por isso o String(...) quando o id é número.</Text>
        <Text style={styles.regra}>• Nunca Math.random(): muda a cada render e recria tudo.</Text>
        <Text style={styles.regra}>
          • Sem keyExtractor, a FlatList tenta item.key, depois item.id, e por último o índice.
        </Text>
      </View>

      <Note>
        O índice só é aceitável quando a lista é fixa: nunca é reordenada, filtrada, nem tem
        itens inseridos ou removidos no meio. Na dúvida, use um id.
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
  colunas: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  coluna: {
    flex: 1,
    gap: Spacing.xs,
  },
  colunaTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  colunaSub: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.danger,
    marginBottom: Spacing.xs,
  },
  colunaSubOk: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
    marginBottom: Spacing.xs,
  },
  item: {
    padding: Spacing.sm,
    borderRadius: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  itemDestacado: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  itemTexto: {
    fontSize: 12,
    color: Colors.text,
  },
  itemTextoDestacado: {
    color: '#ffffff',
    fontWeight: '600',
  },
  separador: {
    height: Spacing.xs,
  },
  acoes: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  acao: {
    flex: 1,
  },
  regras: {
    gap: Spacing.xs,
    padding: Spacing.md,
    borderRadius: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  regrasTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  regra: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
  },
});
