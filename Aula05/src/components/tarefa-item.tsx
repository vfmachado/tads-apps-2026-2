import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';
import type { Tarefa } from '@/models/tarefa';

interface TarefaItemProps {
  tarefa: Tarefa;
  // O item não sabe para onde navegar: quem decide é a tela que o usa.
  onPress?: () => void;
}

export function TarefaItem({ tarefa, onPress }: TarefaItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}>
      <View style={[styles.marcador, tarefa.concluida && styles.marcadorConcluido]}>
        <Text style={styles.marcadorTexto}>{tarefa.concluida ? '✓' : ''}</Text>
      </View>

      <View style={styles.textos}>
        <Text style={[styles.titulo, tarefa.concluida && styles.tituloConcluido]}>
          {tarefa.titulo}
        </Text>
        <Text style={styles.meta}>
          {tarefa.categoria} · até {tarefa.prazo}
        </Text>
      </View>

      <Text style={styles.seta}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Spacing.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
  marcador: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  marcadorConcluido: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  marcadorTexto: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
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
  tituloConcluido: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  meta: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  seta: {
    fontSize: 22,
    color: Colors.textSecondary,
  },
});
