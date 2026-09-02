import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

interface MenuLinkProps {
  href: Href;
  emoji: string;
  title: string;
  description: string;
}

// Navegação DECLARATIVA: o destino faz parte da árvore de componentes.
// asChild faz o Link usar o Pressable abaixo como área de toque, em vez de
// renderizar um <Text> próprio.
export function MenuLink({ href, emoji, title, description }: MenuLinkProps) {
  return (
    <Link href={href} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={styles.texts}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <Text style={styles.seta}>›</Text>
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
  emoji: {
    fontSize: 22,
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
  seta: {
    fontSize: 22,
    color: Colors.textSecondary,
  },
});
