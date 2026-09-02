import { Link } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { CategoriaCard } from '@/components/categoria-card';
import { Header } from '@/components/header';
import { Note } from '@/components/note';
import { RotaAtual } from '@/components/rota-atual';
import { Colors, Spacing } from '@/constants/theme';
import { CATEGORIAS, contarPorCategoria, type Categoria } from '@/models/tarefa';

const EMOJIS: Record<Categoria, string> = {
  Estudo: '📚',
  Casa: '🏠',
  Trabalho: '💼',
  Pessoal: '🌱',
};

// TELA 2 — src/app/(tabs)/explorar.tsx  ->  rota "/explorar"
//
// Navegação DECLARATIVA com <Link>: o destino está escrito no JSX.
// asChild entrega o toque ao CategoriaCard, que repassa o onPress recebido
// para o seu Pressable.
export default function ExplorarScreen() {
  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <Header title="Explorar" subtitle="Escolha uma categoria para filtrar as tarefas" />

      <Note>
        Aqui o destino está escrito no JSX: o Link monta o caminho
        /categoria/Estudo a partir do arquivo categoria/[nome].tsx mais o
        parâmetro nome.
      </Note>

      <View style={styles.lista}>
        {CATEGORIAS.map((categoria) => (
          <Link
            key={categoria}
            href={{ pathname: '/categoria/[nome]', params: { nome: categoria } }}
            asChild>
            <CategoriaCard
              categoria={categoria}
              total={contarPorCategoria(categoria)}
              emoji={EMOJIS[categoria]}
            />
          </Link>
        ))}
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
  lista: {
    gap: Spacing.sm,
  },
});
