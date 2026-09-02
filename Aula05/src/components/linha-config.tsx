import { StyleSheet, Switch, Text, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

interface LinhaConfigProps {
  titulo: string;
  descricao?: string;
  valor: boolean;
  onChange: (valor: boolean) => void;
}

// Linha de configuração com interruptor. O estado vive na tela de Ajustes —
// e continua lá enquanto a aba estiver montada.
export function LinhaConfig({ titulo, descricao, valor, onChange }: LinhaConfigProps) {
  return (
    <View style={styles.linha}>
      <View style={styles.textos}>
        <Text style={styles.titulo}>{titulo}</Text>
        {descricao ? <Text style={styles.descricao}>{descricao}</Text> : null}
      </View>
      <Switch
        value={valor}
        onValueChange={onChange}
        trackColor={{ true: Colors.primary, false: Colors.border }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  descricao: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
