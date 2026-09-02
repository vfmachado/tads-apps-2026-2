import { Stack } from 'expo-router';

import { Colors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        contentStyle: { backgroundColor: Colors.background },
      }}>
      <Stack.Screen name="index" options={{ title: 'Aula 4 — Listas' }} />
      <Stack.Screen name="scroll-view" options={{ title: '1 · ScrollView' }} />
      <Stack.Screen name="flat-list" options={{ title: '2 · FlatList' }} />
      <Stack.Screen name="chaves" options={{ title: '3 · keyExtractor' }} />
      <Stack.Screen name="lista-tarefas" options={{ title: '4 · Lista completa' }} />
      <Stack.Screen name="desempenho" options={{ title: '5 · Desempenho' }} />
    </Stack>
  );
}
