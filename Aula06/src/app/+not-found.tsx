import { Link, usePathname } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Header } from '@/components/header';
import { Note } from '@/components/note';
import { Colors, Spacing } from '@/constants/theme';

// src/app/+not-found.tsx — qualquer caminho sem arquivo correspondente.
//
// Fica FORA dos dois grupos protegidos: existe logado ou não. O link de
// volta leva para "/", e o layout raiz decide o que "/" significa agora
// (início, se há usuário; login, se não há).
export default function NotFoundScreen() {
  const pathname = usePathname();

  return (
    <View style={styles.tela}>
      <Header title="Rota não encontrada" subtitle="Nenhum arquivo corresponde a este caminho" />

      <Text style={styles.caminho}>{pathname}</Text>

      <Note>
        Rotas escondidas por Stack.Protected não caem aqui: o Expo Router as
        redireciona para a primeira rota disponível do navegador.
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
