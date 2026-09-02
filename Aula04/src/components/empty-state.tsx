import { StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

interface EmptyStateProps {
  titulo: string;
  descricao?: string;
}

// Usado como ListEmptyComponent: a FlatList o exibe quando `data` está vazia.
export function EmptyState({ titulo, descricao }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{titulo}</Text>
      {descricao ? <Text style={styles.descricao}>{descricao}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  descricao: {
    fontSize: 13,
    textAlign: 'center',
    color: Colors.textSecondary,
  },
});
