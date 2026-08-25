import { StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

interface StatePreviewProps {
  title: string;
  // Object.entries devolve pares [chave, valor]: usamos isso para listar o estado.
  data: Record<string, string | number | boolean>;
}

export function StatePreview({ title, data }: StatePreviewProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {Object.entries(data).map(([campo, valor]) => (
        <Text key={campo} style={styles.line}>
          <Text style={styles.field}>{campo}: </Text>
          {formatar(valor)}
        </Text>
      ))}
    </View>
  );
}

function formatar(valor: string | number | boolean) {
  if (typeof valor === 'boolean') return valor ? 'sim' : 'não';
  if (valor === '') return '(vazio)';
  return String(valor);
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.xs,
    padding: Spacing.md,
    borderRadius: Spacing.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  line: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  field: {
    fontWeight: '600',
    color: Colors.text,
  },
});
