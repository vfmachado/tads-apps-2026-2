import { usePathname } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';

// Componente só de material didático: mostra, em tempo real, o que está
// dentro do AuthContext e em que rota o app está.
//
// Ele aparece em telas diferentes (login, início, perfil) sem receber
// NENHUMA prop — é o contexto que chega até ele, onde quer que esteja.
// Repare também que ele re-renderiza sozinho quando o usuário entra ou sai.
export function SessaoAtual() {
  const { usuario, token } = useAuth();
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>useAuth()</Text>
      <Linha rotulo="usuario" valor={usuario ? JSON.stringify(usuario, null, 1) : 'null'} />
      <Linha rotulo="token" valor={token ? `${token.slice(0, 8)}…` : 'null'} />
      <Linha rotulo="usePathname()" valor={pathname} />
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
  titulo: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.primary,
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
