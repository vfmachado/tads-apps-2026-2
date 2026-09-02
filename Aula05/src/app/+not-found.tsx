import { Link, usePathname } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Header } from '@/components/header';
import { Note } from '@/components/note';
import { Colors, Spacing } from '@/constants/theme';

// TELA 8 — src/app/+not-found.tsx
//
// O "+" marca uma rota especial do Expo Router. Esta é chamada sempre que
// nenhum arquivo corresponde ao caminho pedido — inclusive quando o link vem
// de fora do app (deep link) ou da barra de endereços na web.
export default function NotFoundScreen() {
  const pathname = usePathname();

  return (
    <View style={styles.tela}>
      <Header title="Rota não encontrada" subtitle="Nenhum arquivo corresponde a este caminho" />

      <Text style={styles.caminho}>{pathname}</Text>

      <Note>
        Para criar essa rota bastaria adicionar o arquivo correspondente em
        src/app — o roteador se atualiza sozinho, sem registrar nada em lugar
        nenhum.
      </Note>

      <Link href="/" style={styles.link}>
        Voltar para o início
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },
  caminho: {
    fontSize: 15,
    fontFamily: 'monospace',
    color: Colors.danger,
  },
  link: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
});
