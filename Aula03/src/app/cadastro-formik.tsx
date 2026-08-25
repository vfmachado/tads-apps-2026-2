import { useFormik } from 'formik';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Header } from '@/components/header';
import { PrimaryButton } from '@/components/primary-button';
import { StatePreview } from '@/components/state-preview';
import { SwitchField } from '@/components/switch-field';
import { TextField } from '@/components/text-field';
import { Colors, Spacing } from '@/constants/theme';
import { CADASTRO_VAZIO, validarCadastro, type Cadastro } from '@/models/cadastro';

export default function CadastroFormikScreen() {
  const [enviado, setEnviado] = useState<Cadastro | null>(null);

  // O useFormik substitui os três useState da tela anterior:
  // valores, erros e "campos já visitados" (touched) passam a ser dele.
  const formik = useFormik<Cadastro>({
    initialValues: CADASTRO_VAZIO,
    // Reaproveitamos exatamente a mesma função de validação da tela 2.
    // As REGRAS são nossas; o Formik só decide QUANDO rodá-las.
    validate: validarCadastro,
    // Só é chamado quando a validação não encontra nenhum erro.
    onSubmit: (values) => setEnviado(values),
  });

  // Mostra o erro apenas depois que o usuário saiu do campo (onBlur) ou
  // tentou enviar — evita acusar erro enquanto ele ainda está digitando.
  function erroDe(campo: keyof Cadastro) {
    return formik.touched[campo] ? formik.errors[campo] : undefined;
  }

  function limparFormulario() {
    // Volta tudo (valores, erros e touched) para o estado inicial.
    formik.resetForm();
    setEnviado(null);
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">
      <Header
        title="Cadastro com Formik"
        subtitle="O mesmo formulário da tela anterior, sem o estado escrito à mão"
      />

      <View style={styles.form}>
        {/* handleChange('nome') devolve a função que atualiza values.nome —
            é o equivalente ao nosso atualizarCampo('nome', texto). */}
        <TextField
          label="Nome"
          value={formik.values.nome}
          onChangeText={formik.handleChange('nome')}
          onBlur={formik.handleBlur('nome')}
          error={erroDe('nome')}
          placeholder="Digite seu nome"
        />

        <TextField
          label="E-mail"
          value={formik.values.email}
          onChangeText={formik.handleChange('email')}
          onBlur={formik.handleBlur('email')}
          error={erroDe('email')}
          placeholder="voce@exemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextField
          label="Senha"
          value={formik.values.senha}
          onChangeText={formik.handleChange('senha')}
          onBlur={formik.handleBlur('senha')}
          error={erroDe('senha')}
          placeholder="Mínimo de 6 caracteres"
          secureTextEntry
        />

        <TextField
          label="Confirmação da senha"
          value={formik.values.confirmacaoSenha}
          onChangeText={formik.handleChange('confirmacaoSenha')}
          onBlur={formik.handleBlur('confirmacaoSenha')}
          error={erroDe('confirmacaoSenha')}
          placeholder="Repita a senha"
          secureTextEntry
        />

        <TextField
          label="Cidade"
          value={formik.values.cidade}
          onChangeText={formik.handleChange('cidade')}
          onBlur={formik.handleBlur('cidade')}
          error={erroDe('cidade')}
          placeholder="Bento Gonçalves"
        />

        {/* O Switch não é texto, então usamos setFieldValue diretamente. */}
        <SwitchField
          label="Aceito os termos de uso"
          value={formik.values.aceitaTermos}
          onValueChange={(valor) => formik.setFieldValue('aceitaTermos', valor)}
          error={erroDe('aceitaTermos')}
        />
      </View>

      <View style={styles.actions}>
        {/* handleSubmit espera um evento de formulário da web; no React Native
            chamamos sem argumento, dentro de uma arrow function. */}
        <PrimaryButton label="Cadastrar" onPress={() => formik.handleSubmit()} />
        <PrimaryButton label="Limpar" onPress={limparFormulario} variant="secondary" />
      </View>

      <StatePreview
        title="formik.values"
        data={{
          ...formik.values,
          senha: formik.values.senha ? '••••••' : '',
          confirmacaoSenha: formik.values.confirmacaoSenha ? '••••••' : '',
        }}
      />

      <StatePreview
        title="Controle interno do Formik"
        data={{
          'campos com erro': Object.keys(formik.errors).length,
          'campos visitados': Object.keys(formik.touched).length,
          'formulário alterado': formik.dirty,
          'tentativas de envio': formik.submitCount,
        }}
      />

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
