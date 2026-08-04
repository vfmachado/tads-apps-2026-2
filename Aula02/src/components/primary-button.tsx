import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

interface PrimaryButtonProps {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}

export function PrimaryButton({ label, onPress, disabled = false }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Spacing.sm,
    backgroundColor: Colors.primary,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
