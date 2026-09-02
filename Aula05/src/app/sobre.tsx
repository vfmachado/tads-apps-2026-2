import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Header } from '@/components/header';
import { Note } from '@/components/note';
import { PrimaryButton } from '@/components/primary-button';
import { Colors, Spacing } from '@/constants/theme';

// TELA 7 — src/app/sobre.tsx  ->  "/sobre", apresentada como MODAL.
//
// Não há nada de especial neste arquivo: quem define que ele é um modal é o
// layout raiz, com options={{ presentation: 'modal' }}. A mesma tela poderia
// ser empilhada normalmente só mudando aquela linha.
export default function SobreScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <Header title="Sobre o app" subtitle="Aula 5 — Navegação entre telas" />

      <View style={styles.lista}>
        <Item titulo="Rotas" texto="Cada arquivo em src/app vira uma rota." />
        <Item titulo="Layouts" texto="_layout.tsx define o navegador (Stack ou Tabs)." />
        <Item titulo="Parâmetros" texto="[id] no nome do arquivo, useLocalSearchParams na tela." />
        <Item titulo="Modal" texto="presentation: 'modal' no Stack.Screen do layout raiz." />
      </View>

      <Note>
        Um modal é apenas mais uma tela da pilha, com outra animação. Fechar é
        voltar: router.back().
      </Note>

      <PrimaryButton label="Fechar" onPress={() => router.back()} />
    </ScrollView>
  );
}

function Item({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <View style={styles.item}>
      <Text style={styles.itemTitulo}>{titulo}</Text>
      <Text style={styles.itemTexto}>{texto}</Text>
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
  lista: {
    gap: Spacing.sm,
  },
  item: {
    gap: 2,
    padding: Spacing.md,
    borderRadius: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  itemTitulo: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  itemTexto: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
