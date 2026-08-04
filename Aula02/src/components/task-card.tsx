import { StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

interface TaskCardProps {
  title: string;
  description?: string;
  done?: boolean;
}

export function TaskCard({ title, description, done = false }: TaskCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.checkbox, done && styles.checkboxDone]} />
      <View style={styles.texts}>
        <Text style={[styles.title, done && styles.titleDone]}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Spacing.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  checkboxDone: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
