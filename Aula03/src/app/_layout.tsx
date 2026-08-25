import { Stack } from 'expo-router';

import { Colors } from '@/constants/theme';

export default function RootLayout() {
  return (
    // Cada arquivo dentro de src/app vira uma rota. O Stack empilha as telas
    // e dá o botão "voltar" de graça.
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        contentStyle: { backgroundColor: Colors.background },
      }}>
      <Stack.Screen name="index" options={{ title: 'Aula 3 — Estado' }} />
      <Stack.Screen name="estado-simples" options={{ title: '1 · Vários useState' }} />
      <Stack.Screen name="cadastro-objeto" options={{ title: '2 · Estado em objeto' }} />
      <Stack.Screen name="cadastro-formik" options={{ title: '3 · Formik' }} />
    </Stack>
  );
}
