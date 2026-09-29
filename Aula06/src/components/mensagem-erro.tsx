import { StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

interface MensagemErroProps {
  // null = nada para mostrar. A tela guarda o erro em um estado e passa
  // direto; o componente decide se aparece.
  children: string | null;
}

export function MensagemErro({ children }: MensagemErroProps) {
  if (!children) return null;

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
    borderWidth: 1,
    borderColor: Colors.danger,
    backgroundColor: '#FDECEC',
  },
  texto: {
    fontSize: 14,
    color: Colors.danger,
  },
});
