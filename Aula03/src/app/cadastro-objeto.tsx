import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Header } from '@/components/header';
import { PrimaryButton } from '@/components/primary-button';
import { StatePreview } from '@/components/state-preview';
import { SwitchField } from '@/components/switch-field';
import { TextField } from '@/components/text-field';
import { Colors, Spacing } from '@/constants/theme';
import {
  CADASTRO_VAZIO,
  validarCadastro,
  type Cadastro,
  type ErrosCadastro,
} from '@/models/cadastro';

export default function CadastroObjetoScreen() {
  // UM único useState guarda o formulário inteiro.
  const [cadastro, setCadastro] = useState<Cadastro>(CADASTRO_VAZIO);
  // Os erros também são um objeto, com a mesma "forma" do formulário.
  const [erros, setErros] = useState<ErrosCadastro>({});
  // Guarda o último cadastro enviado com sucesso (null = ainda não enviou).
  const [enviado, setEnviado] = useState<Cadastro | null>(null);

  // Uma única função atualiza QUALQUER campo.
  // O genérico <C extends keyof Cadastro> garante que o valor recebido tenha
  // o tipo certo do campo: atualizarCampo('nome', true) não compila.
  function atualizarCampo<C extends keyof Cadastro>(campo: C, valor: Cadastro[C]) {
    // IMUTABILIDADE: nunca fazemos `cadastro.nome = valor`.
    // Criamos um objeto NOVO copiando o anterior (...anterior) e trocando
    // apenas um campo. Sem isso o React não percebe a mudança e não redesenha.
    setCadastro((anterior) => ({ ...anterior, [campo]: valor }));

    // Assim que o usuário corrige o campo, apagamos o erro dele.
    setErros((anterior) => ({ ...anterior, [campo]: undefined }));
  }

  function enviar() {
    const novosErros = validarCadastro(cadastro);
    setErros(novosErros);

    // Object.keys({}) tem length 0 — ou seja, nenhum erro encontrado.
    if (Object.keys(novosErros).length > 0) {
      setEnviado(null);
      return;
    }

    setEnviado(cadastro);
  }

  function limparFormulario() {
    // Com o estado em objeto, limpar é uma linha só.
    setCadastro(CADASTRO_VAZIO);
    setErros({});
    setEnviado(null);
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">
      <Header
        title="Cadastro"
        subtitle="Um objeto no estado, uma função para atualizar qualquer campo"
      />

      <View style={styles.form}>
        <TextField
          label="Nome"
          value={cadastro.nome}
          onChangeText={(texto) => atualizarCampo('nome', texto)}
          error={erros.nome}
          placeholder="Digite seu nome"
        />

        <TextField
          label="E-mail"
          value={cadastro.email}
          onChangeText={(texto) => atualizarCampo('email', texto)}
          error={erros.email}
          placeholder="voce@exemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextField
          label="Senha"
          value={cadastro.senha}
          onChangeText={(texto) => atualizarCampo('senha', texto)}
          error={erros.senha}
          placeholder="Mínimo de 6 caracteres"
          secureTextEntry
        />

        <TextField
          label="Confirmação da senha"
          value={cadastro.confirmacaoSenha}
          onChangeText={(texto) => atualizarCampo('confirmacaoSenha', texto)}
          error={erros.confirmacaoSenha}
          placeholder="Repita a senha"
          secureTextEntry
        />

        <TextField
          label="Cidade"
          value={cadastro.cidade}
          onChangeText={(texto) => atualizarCampo('cidade', texto)}
          error={erros.cidade}
          placeholder="Bento Gonçalves"
        />

        <SwitchField
          label="Aceito os termos de uso"
          value={cadastro.aceitaTermos}
          onValueChange={(valor) => atualizarCampo('aceitaTermos', valor)}
          error={erros.aceitaTermos}
        />
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Cadastrar" onPress={enviar} />
        <PrimaryButton label="Limpar" onPress={limparFormulario} variant="secondary" />
      </View>

      <StatePreview
        title="Estado do formulário"
        data={{
          ...cadastro,
          // Nunca exibimos a senha em tela: mostramos só se está preenchida.
          senha: cadastro.senha ? '••••••' : '',
          confirmacaoSenha: cadastro.confirmacaoSenha ? '••••••' : '',
        }}
      />

      {/* Renderização condicional: só aparece depois de um envio válido. */}
      {enviado ? (
        <View style={styles.success}>
          <Text style={styles.successTitle}>Cadastro enviado</Text>
          <Text style={styles.successText}>
            {enviado.nome} · {enviado.email} · {enviado.cidade}
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.lg,
  },
  form: {
    gap: Spacing.md,
  },
  actions: {
    gap: Spacing.sm,
  },
  success: {
    gap: Spacing.xs,
    padding: Spacing.md,
    borderRadius: Spacing.sm,
    backgroundColor: '#EAF9F0',
    borderWidth: 1,
    borderColor: Colors.success,
  },
  successTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  successText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
