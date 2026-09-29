import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { Header } from '@/components/header';
import { MensagemErro } from '@/components/mensagem-erro';
import { Note } from '@/components/note';
import { PrimaryButton } from '@/components/primary-button';
import { UsuarioItem } from '@/components/usuario-item';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import type { UsuarioResumo } from '@/models/usuario';
import { api } from '@/services/api';

// ADMINISTRAÇÃO — src/app/(app)/admin.tsx  ->  rota "/admin"
//
// Esta tela só é montada para admin: o Stack.Protected em (app)/_layout.tsx
// a esconde dos demais. A proteção de verdade, porém, está no servidor —
// GET /usuarios responde 403 para qualquer token que não seja de admin,
// não importa o que o app faça.
export default function AdminScreen() {
  const { usuario, token } = useAuth();

  const [usuarios, setUsuarios] = useState<UsuarioResumo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setErro(null);
    setCarregando(true);
    try {
      setUsuarios(await api.listarUsuarios(token));
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível carregar.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <FlatList
      style={styles.tela}
      contentContainerStyle={styles.conteudo}
      data={usuarios}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <UsuarioItem usuario={item} souEu={item.id === usuario?.id} />}
      ItemSeparatorComponent={() => <View style={styles.separador} />}
      ListHeaderComponent={
        <View style={styles.cabecalho}>
          <Header title="Usuários" subtitle="Todas as contas na memória do servidor" />
          <MensagemErro>{erro}</MensagemErro>
          <PrimaryButton
            label={carregando ? 'Atualizando…' : 'Atualizar'}
            variant="secondary"
            onPress={carregar}
            disabled={carregando}
          />
        </View>
      }
      ListEmptyComponent={carregando ? <EmptyState titulo="Carregando…" /> : null}
      ListFooterComponent={
        <View style={styles.rodape}>
          <Note>
            Peça para alguém da turma se cadastrar e toque em Atualizar. Depois
            reinicie o servidor: a conta some, porque o "banco" é um Map em
            memória.
          </Note>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  conteudo: {
    padding: Spacing.lg,
  },
  cabecalho: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  separador: {
    height: Spacing.sm,
  },
  rodape: {
    marginTop: Spacing.lg,
  },
});
