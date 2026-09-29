import { StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';
import type { UsuarioResumo } from '@/models/usuario';

interface UsuarioItemProps {
  usuario: UsuarioResumo;
  // Destaca a linha de quem está olhando a lista.
  souEu?: boolean;
}

export function UsuarioItem({ usuario, souEu = false }: UsuarioItemProps) {
  const admin = usuario.papel === 'admin';

  return (
    <View style={[styles.item, souEu && styles.itemDestacado]}>
      <View style={styles.textos}>
        <Text style={styles.nome}>
          {usuario.nome}
          {souEu ? ' (você)' : ''}
        </Text>
        <Text style={styles.email}>{usuario.email}</Text>
      </View>
      <View style={styles.lado}>
        <Text style={[styles.papel, admin && styles.papelAdmin]}>{usuario.papel}</Text>
        <Text style={styles.contagem}>
          {usuario.totalAnotacoes} {usuario.totalAnotacoes === 1 ? 'anotação' : 'anotações'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  itemDestacado: {
    borderColor: Colors.primary,
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  nome: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  email: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  lado: {
    alignItems: 'flex-end',
    gap: 2,
  },
  papel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: Colors.textSecondary,
  },
  papelAdmin: {
    color: Colors.primary,
  },
  contagem: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
