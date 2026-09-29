import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

// Rótulo + TextInput. Aceita todas as props do TextInput (keyboardType,
// secureTextEntry, autoCapitalize...) e as repassa com `...rest`.
// Formulários são o assunto da Aula 7 — aqui só o mínimo para o login.
interface CampoProps extends TextInputProps {
  rotulo: string;
}

export function Campo({ rotulo, style, ...rest }: CampoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={Colors.textSecondary}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  rotulo: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  input: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    fontSize: 16,
    color: Colors.text,
  },
});
