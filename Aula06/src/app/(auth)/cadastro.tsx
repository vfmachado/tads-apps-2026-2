import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Campo } from '@/components/campo';
import { Header } from '@/components/header';
import { MensagemErro } from '@/components/mensagem-erro';
import { Note } from '@/components/note';
import { PrimaryButton } from '@/components/primary-button';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';

// TELA DE CADASTRO — src/app/(auth)/cadastro.tsx  ->  rota "/cadastro"
//
// Mesmo desenho do login: o formulário é da tela; a sessão é do contexto.
// O servidor já devolve a sessão no cadastro, então `cadastrar` também
// deixa o usuário logado — e o layout raiz troca de grupo do mesmo jeito.
export default function CadastroScreen() {
  const { cadastrar } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleCadastrar() {
    setErro(null);
    setEnviando(true);
    try {
      await cadastrar(nome, email, senha);
    } catch (e) {
      // As regras (e-mail válido, senha mínima, e-mail repetido) estão no
      // servidor; a tela só mostra a mensagem que ele mandou.
      setErro(e instanceof Error ? e.message : 'Não foi possível cadastrar.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets>
      <Header title="Criar conta" subtitle="A conta vale enquanto o servidor estiver no ar" />

      <View style={styles.formulario}>
        <Campo
          rotulo="Nome"
          value={nome}
          onChangeText={setNome}
          placeholder="Como quer ser chamado"
          autoComplete="name"
        />
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
          placeholder="Pelo menos 6 caracteres"
          secureTextEntry
          onSubmitEditing={handleCadastrar}
        />

        <MensagemErro>{erro}</MensagemErro>

        <PrimaryButton
          label={enviando ? 'Criando conta…' : 'Criar conta e entrar'}
          onPress={handleCadastrar}
          disabled={enviando || !nome || !email || !senha}
        />
      </View>

      <Note>
        Os dados ficam só na memória do servidor: reiniciá-lo apaga as contas
        criadas em aula. As contas de teste voltam sozinhas.
      </Note>
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
});
