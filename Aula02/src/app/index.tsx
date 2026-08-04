import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { Header } from '@/components/header';
import { PrimaryButton } from '@/components/primary-button';
import { TaskCard } from '@/components/task-card';
import { Colors, Spacing } from '@/constants/theme';

// Dados fixos apenas para exibição — sem estado, sem lógica de app.
const tasks = [
  { id: '1', title: 'Estudar JSX', description: 'Sintaxe e expressões dentro de { }', done: true },
  { id: '2', title: 'Criar componentes', description: 'Header, TaskCard, PrimaryButton, EmptyState', done: false },
  { id: '3', title: 'Tipar props com TypeScript', done: false },
];

export default function TodoScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header title="Minhas tarefas" subtitle={`${tasks.length} tarefas`} />

        <View style={styles.list}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              description={task.description}
              done={task.done}
            />
          ))}
        </View>

        <PrimaryButton label="Adicionar tarefa" />

        <Header title="Estado vazio" subtitle="Exemplo de composição do EmptyState" />
        <EmptyState
          title="Nenhuma tarefa"
          message="Quando você criar tarefas, elas vão aparecer aqui."
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
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
