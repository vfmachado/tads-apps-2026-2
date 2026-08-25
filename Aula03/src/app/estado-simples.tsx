import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Header } from '@/components/header';
import { PrimaryButton } from '@/components/primary-button';
import { StatePreview } from '@/components/state-preview';
import { SwitchField } from '@/components/switch-field';
import { TextField } from '@/components/text-field';
import { Colors, Spacing } from '@/constants/theme';

export default function EstadoSimplesScreen() {
  // useState devolve um par: [valor atual, função que troca o valor].
  // Trocar o valor faz o React renderizar o componente de novo.
  const [contador, setContador] = useState(0);

  // Um useState para CADA campo do formulário.
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [idade, setIdade] = useState('');
  const [cidade, setCidade] = useState('');
  const [receberNovidades, setReceberNovidades] = useState(false);

  // Estado derivado: é calculado a partir do estado durante a renderização.
  // Não precisa (nem deve) virar um useState — senão haveria dois lugares
  // guardando a mesma informação, com risco de ficarem diferentes.
  const camposPreenchidos = [nome, email, idade, cidade].filter(
    (valor) => valor.trim() !== ''
  ).length;

  function limparFormulario() {
    // Com um useState por campo, limpar o formulário significa
    // chamar todos os setters, um a um.
    setNome('');
    setEmail('');
    setIdade('');
    setCidade('');
    setReceberNovidades(false);
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">
      <Header
        title="Vários useState"
        subtitle="Um estado independente para cada informação da tela"
      />

      {/* --- Contador: o exemplo mais direto de estado + evento --- */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Contador</Text>
        <View style={styles.counterRow}>
          {/* Forma funcional: recebe o valor anterior e devolve o novo.
              É a forma segura quando o novo valor depende do anterior. */}
          <Pressable style={styles.counterButton} onPress={() => setContador((anterior) => anterior - 1)}>
            <Text style={styles.counterButtonText}>−</Text>
          </Pressable>

          <Text style={styles.counterValue}>{contador}</Text>

          <Pressable style={styles.counterButton} onPress={() => setContador((anterior) => anterior + 1)}>
            <Text style={styles.counterButtonText}>+</Text>
          </Pressable>
        </View>

        {/* Renderização condicional: o JSX muda conforme o estado. */}
        {contador === 0 ? (
          <Text style={styles.cardHint}>
            Toque nos botões: cada toque muda o estado e o React redesenha a tela.
          </Text>
        ) : (
          <Text style={styles.cardHint}>
            Valor {contador % 2 === 0 ? 'par' : 'ímpar'} — este texto também é calculado a partir do
            estado.
          </Text>
        )}
      </View>

      {/* --- Campos controlados --- */}
      {/* Componente controlado: o TextInput NÃO guarda o texto sozinho.
          Ele mostra o que está no estado (value) e avisa quando o usuário
          digita (onChangeText). O estado é a única fonte da verdade. */}
      <View style={styles.form}>
        <TextField
          label="Nome"
          value={nome}
          onChangeText={setNome}
          placeholder="Digite seu nome"
        />

        <TextField
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="voce@exemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextField
          label="Idade"
          value={idade}
          // TextInput sempre trabalha com texto: filtramos para aceitar só dígitos.
          onChangeText={(texto) => setIdade(texto.replace(/[^0-9]/g, ''))}
          placeholder="18"
          keyboardType="number-pad"
          maxLength={3}
        />

        <TextField
          label="Cidade"
          value={cidade}
          onChangeText={setCidade}
          placeholder="Bento Gonçalves"
        />

        <SwitchField
          label="Quero receber novidades"
          value={receberNovidades}
          onValueChange={setReceberNovidades}
        />
      </View>

      {/* O preview muda a cada tecla digitada — prova de que o estado
          está sempre sincronizado com a interface. */}
      <StatePreview
        title={`Estado atual (${camposPreenchidos} de 4 campos preenchidos)`}
        data={{ nome, email, idade, cidade, receberNovidades }}
      />

      <PrimaryButton label="Limpar formulário" onPress={limparFormulario} />

      <Text style={styles.footer}>
        Repare: são 5 useState, 5 setters e um limpar() que precisa chamar todos eles. Com 15 campos,
        isso vira um problema. É o que a próxima tela resolve.
      </Text>
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
  card: {
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Spacing.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  cardHint: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  counterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  counterButtonText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },
  counterValue: {
    minWidth: 56,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  form: {
    gap: Spacing.md,
  },
  footer: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
