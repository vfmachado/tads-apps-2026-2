import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';
import type { Tarefa } from '@/models/tarefa';

interface TarefaItemProps {
  tarefa: Tarefa;
  // A lista não sabe o que acontece no toque: quem decide é a tela.
  onPress?: () => void;
  onLongPress?: () => void;
}

export function TarefaItem({ tarefa, onPress, onLongPress }: TarefaItemProps) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}>
      <View style={[styles.marcador, tarefa.concluida && styles.marcadorConcluido]}>
        <Text style={styles.marcadorTexto}>{tarefa.concluida ? '✓' : ''}</Text>
      </View>

      <View style={styles.textos}>
        <Text style={[styles.titulo, tarefa.concluida && styles.tituloConcluido]}>
          {tarefa.titulo}
        </Text>
        <Text style={styles.categoria}>{tarefa.categoria}</Text>
      </View>
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
  categoria: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
