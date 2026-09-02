import { useLocalSearchParams, usePathname, useSegments } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

// Componente só de material didático: mostra, em tempo real, como o
// Expo Router enxerga a tela atual.
//
//   usePathname()          -> o caminho já resolvido: /tarefa/t3
//   useSegments()          -> os pedaços do arquivo: ['tarefa', '[id]']
//   useLocalSearchParams() -> os parâmetros DESTA tela: { id: 't3' }
export function RotaAtual() {
  const pathname = usePathname();
  const segments = useSegments();
  const params = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Linha rotulo="usePathname()" valor={pathname} />
      <Linha rotulo="useSegments()" valor={JSON.stringify(segments)} />
      <Linha rotulo="useLocalSearchParams()" valor={JSON.stringify(params)} />
    </View>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={styles.linha}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Spacing.sm,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  linha: {
    gap: 2,
  },
  rotulo: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  valor: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: Colors.text,
  },
});
