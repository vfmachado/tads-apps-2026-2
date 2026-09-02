import { StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

interface NoteProps {
  children: string;
}

// Caixinha de explicação usada nas telas — só para o material de aula.
export function Note({ children }: NoteProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    borderRadius: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  texto: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
  },
});
