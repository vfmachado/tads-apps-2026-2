import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Chip } from '@/components/chip';
import { Header } from '@/components/header';
import { Note } from '@/components/note';
import { PrimaryButton } from '@/components/primary-button';
import { Colors, Spacing } from '@/constants/theme';
import { gerarTarefas, type Tarefa } from '@/models/tarefa';

const TOTAL = 10600;
const TAREFAS_GERADAS = gerarTarefas(TOTAL);

type Modo = 'flatlist' | 'scrollview';

// Cada linha avisa quando é criada. É assim que contamos quantas
// realmente foram montadas — e não apenas quantas existem no array.
function Linha({ tarefa, aoMontar }: { tarefa: Tarefa; aoMontar: () => void }) {
  useEffect(() => {
    aoMontar();
  }, [aoMontar]);

  return (
    <View style={styles.linha}>
      <Text style={styles.linhaTexto} numberOfLines={1}>
        {tarefa.titulo}
      </Text>
      <Text style={styles.linhaCategoria}>{tarefa.categoria}</Text>
    </View>
  );
}

export default function DesempenhoScreen() {
  const [modo, setModo] = useState<Modo>('flatlist');
  const [montados, setMontados] = useState(0);

  // useRef guarda um valor entre renderizações SEM disparar nova renderização.
  // Se usássemos useState aqui, cada item montado redesenharia a tela inteira.
  const contador = useRef(0);

  const registrarMontagem = useCallback(() => {
    contador.current += 1;
  }, []);

  function trocarModo(novo: Modo) {
    contador.current = 0;
    setMontados(0);
    setModo(novo);
  }

  // Mede logo após a lista aparecer.
  useEffect(() => {
    const temporizador = setTimeout(() => setMontados(contador.current), 600);
    return () => clearTimeout(temporizador);
  }, [modo]);

  return (
    <View style={styles.screen}>
      <View style={styles.painel}>
        <Header title="Desempenho" subtitle={`${TOTAL} itens nas duas abordagens`} />

        <View style={styles.filtros}>
          <Chip
            label="FlatList"
            selected={modo === 'flatlist'}
            onPress={() => trocarModo('flatlist')}
          />
          <Chip
            label="ScrollView"
            selected={modo === 'scrollview'}
            onPress={() => trocarModo('scrollview')}
          />
        </View>

        <View style={styles.placar}>
          <Text style={styles.placarNumero}>{montados}</Text>
          <Text style={styles.placarTexto}>
            de {TOTAL} itens criados{'\n'}(role e meça de novo)
          </Text>
        </View>

        <PrimaryButton
          label="Medir agora"
          variant="secondary"
          onPress={() => setMontados(contador.current)}
        />

        <Note>
          O ScrollView cria os 600 de uma vez. A FlatList cria umas poucas dezenas e vai
          criando o resto conforme você rola — é a mesma ideia de "renderizar só o que se vê".
        </Note>
      </View>

      {/* A key força a lista a ser recriada do zero ao trocar de modo,
          para que a contagem comece sempre limpa. */}
      {modo === 'flatlist' ? (
        <FlatList
          key="flatlist"
          data={TAREFAS_GERADAS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Linha tarefa={item} aoMontar={registrarMontagem} />}
          contentContainerStyle={styles.lista}
          // Ajustes finos (opcionais) de quanto a FlatList mantém montado:
          initialNumToRender={10}

          // onEndReachedThreshold={}
          // onStartReachedThreshold={}
          
          windowSize={5}
          removeClippedSubviews
        />
      ) : (
        <ScrollView key="scrollview" contentContainerStyle={styles.lista}>
          {TAREFAS_GERADAS.map((tarefa) => (
            <Linha key={tarefa.id} tarefa={tarefa} aoMontar={registrarMontagem} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  painel: {
    gap: Spacing.md,
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filtros: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  placar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Spacing.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  placarNumero: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
  },
  placarTexto: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  lista: {
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Spacing.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  linhaTexto: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  linhaCategoria: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
