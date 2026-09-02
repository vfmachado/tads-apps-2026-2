import { Stack, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Header } from '@/components/header';
import { Note } from '@/components/note';
import { PrimaryButton } from '@/components/primary-button';
import { RotaAtual } from '@/components/rota-atual';
import { Colors, Spacing } from '@/constants/theme';

// TELA 6 — src/app/pilha.tsx  ->  "/pilha?nivel=3"
//
// Laboratório: a MESMA tela abre a si própria com um nível maior, e o
// contador mostra quantas telas existem na pilha. É a forma mais direta de
// enxergar a diferença entre push, replace e navigate.
export default function PilhaScreen() {
  const { nivel } = useLocalSearchParams<{ nivel?: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  // Parâmetro chega como string: "2", não 2.
  const nivelAtual = Number(nivel ?? '1');
  const proximo = String(nivelAtual + 1);

  // Espiada no estado do navegador: quantas telas estão empilhadas agora.
  const telasNaPilha = navigation.getState()?.routes.length ?? 0;

  const destino = { pathname: '/pilha', params: { nivel: proximo } } as const;

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <Stack.Screen options={{ title: `Pilha · nível ${nivelAtual}` }} />

      <Header
        title={`Nível ${nivelAtual}`}
        subtitle={`${telasNaPilha} tela(s) na pilha raiz`}
      />

      <Note>
        Abra o nível 5 com push e volte contando os toques. Depois refaça o
        caminho com replace: a pilha nunca cresce e um único voltar sai daqui.
      </Note>

      <View style={styles.acoes}>
        <PrimaryButton
          label={`push → nível ${proximo}`}
          // Empilha uma NOVA tela por cima. A anterior continua viva embaixo.
          onPress={() => router.push(destino)}
        />
        <PrimaryButton
          label={`replace → nível ${proximo}`}
          variant="secondary"
          // Troca a tela atual pela nova: a pilha mantém o mesmo tamanho e a
          // tela substituída não volta com o botão voltar.
          onPress={() => router.replace(destino)}
        />
        <PrimaryButton
          label={`navigate → nível ${proximo}`}
          variant="secondary"
          // navigate reaproveita a tela quando a ROTA é a mesma (aqui,
          // /pilha): em vez de empilhar, ele só atualiza os parâmetros.
          onPress={() => router.navigate(destino)}
        />
      </View>

      <View style={styles.acoes}>
        <Text style={styles.rotulo}>Saídas</Text>
        <PrimaryButton
          label="back — uma tela para trás"
          variant="secondary"
          disabled={!router.canGoBack()}
          onPress={() => router.back()}
        />
        <PrimaryButton
          label="dismissAll — volta ao início da pilha"
          variant="secondary"
          disabled={!router.canDismiss()}
          onPress={() => router.dismissAll()}
        />
        <PrimaryButton
          label="dismissTo('/ajustes') — fecha até os Ajustes"
          variant="secondary"
          onPress={() => router.dismissTo('/ajustes')}
        />
      </View>

      <RotaAtual />
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
  acoes: {
    gap: Spacing.sm,
  },
  rotulo: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Colors.textSecondary,
  },
});
