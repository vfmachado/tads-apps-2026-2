import { StyleSheet, Switch, Text, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

interface SwitchFieldProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  error?: string;
}

export function SwitchField({ label, value, onValueChange, error }: SwitchFieldProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: Colors.border, true: Colors.primary }}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  error: {
    fontSize: 12,
    color: Colors.danger,
  },
});
