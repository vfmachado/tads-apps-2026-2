import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { AnotacaoItem } from '@/components/anotacao-item';
import { Campo } from '@/components/campo';
import { EmptyState } from '@/components/empty-state';
import { Header } from '@/components/header';
import { MensagemErro } from '@/components/mensagem-erro';
import { Note } from '@/components/note';
import { PrimaryButton } from '@/components/primary-button';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import type { Anotacao } from '@/models/usuario';
import { api } from '@/services/api';

// ANOTAÇÕES — src/app/(app)/anotacoes.tsx  ->  rota "/anotacoes"
//
// Aqui o token do contexto é usado de verdade: cada requisição leva
// `Authorization: Bearer <token>`, e o servidor devolve só as anotações de
// quem o token identifica. Entre como Ana e depois como outra conta para
// ver listas diferentes.
export default function AnotacoesScreen() {
  const { token } = useAuth();

  const [anotacoes, setAnotacoes] = useState<Anotacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [texto, setTexto] = useState('');
  const [salvando, setSalvando] = useState(false);

  // useEffect com [] roda uma vez, quando a tela é montada: é o momento de
  // buscar os dados. (Requisições e seus estados são a Aula 10 e a 11 —
  // aqui está o esqueleto mínimo: carregando / erro / dados.)
  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setErro(null);
    setCarregando(true);
    try {
      setAnotacoes(await api.listarAnotacoes(token));
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível carregar.');
    } finally {
      setCarregando(false);
    }
  }

  async function adicionar() {
    setErro(null);
    setSalvando(true);
    try {
      const nova = await api.criarAnotacao(token, texto);
      // Imutabilidade (Aula 4): uma lista nova, com a anotação na frente.
      setAnotacoes((atuais) => [nova, ...atuais]);
      setTexto('');
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível salvar.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <FlatList
      style={styles.tela}
      contentContainerStyle={styles.conteudo}
      data={anotacoes}
      keyExtractor={(anotacao) => anotacao.id}
      renderItem={({ item }) => <AnotacaoItem anotacao={item} />}
      ItemSeparatorComponent={() => <View style={styles.separador} />}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View style={styles.cabecalho}>
          <Header title="Minhas anotações" subtitle="Só as suas — o servidor filtra pelo token" />
          <View style={styles.formulario}>
            <Campo
              rotulo="Nova anotação"
              value={texto}
              onChangeText={setTexto}
              placeholder="O que você não quer esquecer?"
              onSubmitEditing={adicionar}
            />
            <PrimaryButton
              label={salvando ? 'Salvando…' : 'Adicionar'}
              onPress={adicionar}
              disabled={salvando || !texto.trim()}
            />
          </View>
          <MensagemErro>{erro}</MensagemErro>
          {erro ? (
            <PrimaryButton label="Tentar de novo" variant="secondary" onPress={carregar} />
          ) : null}
        </View>
      }
      ListEmptyComponent={
        carregando ? (
          <EmptyState titulo="Carregando…" />
        ) : erro ? null : (
          <EmptyState
            titulo="Nenhuma anotação ainda"
            descricao="Escreva a primeira no campo acima."
          />
        )
      }
      ListFooterComponent={
        <View style={styles.rodape}>
          <Note>
            Abra o terminal do servidor: cada toque aqui aparece lá como
            GET /anotacoes ou POST /anotacoes, sempre com o mesmo token.
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
  formulario: {
    gap: Spacing.sm,
  },
  separador: {
    height: Spacing.sm,
  },
  rodape: {
    marginTop: Spacing.lg,
  },
});
