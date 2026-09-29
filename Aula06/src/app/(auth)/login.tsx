import { Link } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Campo } from '@/components/campo';
import { Header } from '@/components/header';
import { MensagemErro } from '@/components/mensagem-erro';
import { Note } from '@/components/note';
import { PrimaryButton } from '@/components/primary-button';
import { SessaoAtual } from '@/components/sessao-atual';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { API_URL } from '@/services/api';

// TELA DE LOGIN — src/app/(auth)/login.tsx  ->  rota "/login"
//
// A tela não guarda o usuário: ela só pede ao contexto para entrar. O que
// é dela é o estado do FORMULÁRIO — campos, erro e "enviando".
export default function LoginScreen() {
  const { entrar } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleEntrar() {
    setErro(null);
    setEnviando(true);
    try {
      await entrar(email, senha);
      // Deu certo: o AuthProvider mudou `usuario`, o layout raiz reagiu e
      // esta tela já não existe mais. Não há router.replace('/') aqui.
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível entrar.');
    } finally {
      setEnviando(false);
    }
  }

  // Atalhos para as contas criadas pelo servidor — só preenchem os campos.
  function usarConta(contaEmail: string, contaSenha: string) {
    setEmail(contaEmail);
    setSenha(contaSenha);
    setErro(null);
  }

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets>
      <Header title="Entrar" subtitle="Use uma conta de teste ou crie a sua" />

      <View style={styles.formulario}>
        <Campo
          rotulo="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="voce@exemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <Campo
          rotulo="Senha"
          value={senha}
          onChangeText={setSenha}
          placeholder="••••••"
          secureTextEntry
          onSubmitEditing={handleEntrar}
        />

        <MensagemErro>{erro}</MensagemErro>

        <PrimaryButton
          label={enviando ? 'Entrando…' : 'Entrar'}
          onPress={handleEntrar}
          disabled={enviando || !email || !senha}
        />
      </View>

      <View style={styles.grupo}>
        <Text style={styles.rotulo}>Contas de teste</Text>
        <View style={styles.atalhos}>
          <PrimaryButton
            label="Ana (usuária)"
            variant="secondary"
            onPress={() => usarConta('ana@ifrs.edu.br', '123456')}
          />
          <PrimaryButton
            label="Administrador"
            variant="secondary"
            onPress={() => usarConta('admin@ifrs.edu.br', 'admin123')}
          />
        </View>
      </View>

      <Link href="/cadastro" style={styles.link}>
        Ainda não tem conta? Cadastre-se
      </Link>

      <Note>
        {`O app está falando com ${API_URL}. Se o login falhar com erro de conexão, confira se o servidor está rodando (cd server && npm start).`}
      </Note>

      {/* Mesmo sem ninguém logado o contexto existe — só está vazio. */}
      <SessaoAtual />
    </ScrollView>
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
  formulario: {
    gap: Spacing.md,
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
  atalhos: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  link: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.primary,
  },
});
