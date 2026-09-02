import { Pressable, StyleSheet, Text, View, type PressableProps } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';
import type { Categoria } from '@/models/tarefa';

// Repare no `...rest`: ele repassa ao Pressable tudo o que vier de fora —
// inclusive o `onPress` que o <Link asChild> injeta neste componente.
interface CategoriaCardProps extends PressableProps {
  categoria: Categoria;
  total: number;
  emoji: string;
}

export function CategoriaCard({ categoria, total, emoji, ...rest }: CategoriaCardProps) {
  return (
    <Pressable
      {...rest}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button">
      <Text style={styles.emoji}>{emoji}</Text>
      <View style={styles.textos}>
        <Text style={styles.titulo}>{categoria}</Text>
        <Text style={styles.subtitulo}>
          {total} {total === 1 ? 'tarefa' : 'tarefas'}
        </Text>
      </View>
      <Text style={styles.seta}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  pressed: {
    opacity: 0.7,
  },
  emoji: {
    fontSize: 24,
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  subtitulo: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  seta: {
    fontSize: 22,
    color: Colors.textSecondary,
  },
});
