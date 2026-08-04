import { Image, StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

interface EmptyStateProps {
  title: string;
  message?: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/icon.png')} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xl,
  },
  image: {
    width: 64,
    height: 64,
    opacity: 0.5,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  message: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
