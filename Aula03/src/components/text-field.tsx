import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

// Herdamos todas as props do TextInput e acrescentamos as nossas.
interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export function TextField({ label, error, style, ...rest }: TextFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={Colors.textSecondary}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  input: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    fontSize: 16,
    color: Colors.text,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  error: {
    fontSize: 12,
    color: Colors.danger,
  },
});
