import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

interface MenuLinkProps {
  href: Href;
  step: string;
  title: string;
  description: string;
}

export function MenuLink({ href, step, title, description }: MenuLinkProps) {
  return (
    // asChild faz o Link usar o Pressable abaixo como área de toque.
    <Link href={href} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{step}</Text>
        </View>
        <View style={styles.texts}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
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
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
