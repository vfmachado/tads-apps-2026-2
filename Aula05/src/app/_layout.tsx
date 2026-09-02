import { Stack } from 'expo-router';

import { Colors } from '@/constants/theme';

// LAYOUT RAIZ — src/app/_layout.tsx
//
// Todo arquivo `_layout.tsx` define o "esqueleto" das rotas que estão ao lado
// dele e abaixo dele. Este é o layout mais externo do app: um Stack (pilha).
//
// A pilha empilha telas: a nova entra por cima, o botão voltar remove a de
// cima. É o padrão de "listagem -> detalhes".
//
// <Stack.Screen> aqui NÃO renderiza a tela: só configura opções para a rota
// de mesmo nome. As telas continuam sendo os arquivos dentro de src/app.
export default function RootLayout() {
  return (
    <Stack
      // screenOptions vale para todas as telas desta pilha.
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        contentStyle: { backgroundColor: Colors.background },
      }}>
      {/* O grupo (tabs) é UMA tela desta pilha — e ele já tem o próprio
          cabeçalho, vindo do layout das abas. Por isso escondemos este. */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Telas que entram POR CIMA das abas (a barra de abas some). */}
      <Stack.Screen name="tarefa/[id]" options={{ title: 'Detalhes' }} />
      <Stack.Screen name="categoria/[nome]" options={{ title: 'Categoria' }} />
      <Stack.Screen name="pilha" options={{ title: 'Pilha de navegação' }} />

      {/* Modal: entra de baixo para cima e cobre a tela anterior sem
          descartá-la. Fecha com router.back() ou com o gesto de arrastar. */}
      <Stack.Screen
        name="sobre"
        options={{ presentation: 'modal', title: 'Sobre o app' }}
      />

      {/* Rota especial: qualquer caminho que não existir cai aqui. */}
      <Stack.Screen name="+not-found" options={{ title: 'Rota não encontrada' }} />
    </Stack>
  );
}
