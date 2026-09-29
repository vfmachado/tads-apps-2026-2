import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Header } from '@/components/header';
import { MensagemErro } from '@/components/mensagem-erro';
import { Note } from '@/components/note';
import { PrimaryButton } from '@/components/primary-button';
import { SessaoAtual } from '@/components/sessao-atual';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/services/api';

// PERFIL — src/app/(app)/perfil.tsx  ->  rota "/perfil"
//
// Mostra o que está no contexto e oferece a saída. Também confere com o
// servidor se o token ainda vale (GET /auth/me) — útil para o experimento
// de reiniciar o servidor com o app logado.
export default function PerfilScreen() {
  const { usuario, token, sair } = useAuth();

  const [confirmacao, setConfirmacao] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [saindo, setSaindo] = useState(false);

  if (!usuario) return null;

  async function conferirNoServidor() {
    setErro(null);
    setConfirmacao(null);
    try {
      const doServidor = await api.perfil(token);
      setConfirmacao(`O servidor reconhece o token: ${doServidor.nome} (${doServidor.email}).`);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha ao consultar o servidor.');
    }
  }

  async function handleSair() {
    setSaindo(true);
    await sair();
    // Assim como no login, nada de navegação: `usuario` virou null, o grupo
    // (app) deixou de existir e o Expo Router levou o app para o login.
  }

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <Header title={usuario.nome} subtitle={usuario.email} />

      <View style={styles.grupo}>
        <Text style={styles.rotulo}>Sessão</Text>
        <Linha rotulo="Papel" valor={usuario.papel} />
        <Linha rotulo="Cadastro" valor={new Date(usuario.criadoEm).toLocaleString('pt-BR')} />
        <Linha rotulo="Token" valor={token ?? '—'} mono />
      </View>

      <View style={styles.grupo}>
        <PrimaryButton
          label="Conferir token no servidor"
          variant="secondary"
          onPress={conferirNoServidor}
        />
        {confirmacao ? <Text style={styles.confirmacao}>{confirmacao}</Text> : null}
        <MensagemErro>{erro}</MensagemErro>
      </View>

      <Note>
        A sessão vive só na memória do app: recarregue-o e você volta ao login.
        Guardar o token no aparelho (AsyncStorage) é assunto da aula de
        persistência.
      </Note>

      <PrimaryButton label={saindo ? 'Saindo…' : 'Sair'} onPress={handleSair} disabled={saindo} />

      <SessaoAtual />
    </ScrollView>
  );
}

function Linha({ rotulo, valor, mono = false }: { rotulo: string; valor: string; mono?: boolean }) {
  return (
    <View style={styles.linha}>
      <Text style={styles.linhaRotulo}>{rotulo}</Text>
      <Text style={[styles.linhaValor, mono && styles.mono]} selectable>
        {valor}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  conteudo: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  grupo: {
    gap: Spacing.sm,
  },
  rotulo: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Colors.textSecondary,
  },
  linha: {
    gap: 2,
    padding: Spacing.md,
    borderRadius: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  linhaRotulo: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  linhaValor: {
    fontSize: 15,
    color: Colors.text,
  },
  mono: {
    fontFamily: 'monospace',
    fontSize: 13,
  },
  confirmacao: {
    fontSize: 14,
    color: Colors.success,
  },
});
