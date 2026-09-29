import { Stack } from 'expo-router';

import { Colors } from '@/constants/theme';

// LAYOUT DO GRUPO (auth) — src/app/(auth)/_layout.tsx
//
// Uma pilha com as duas telas de quem ainda não entrou. O grupo inteiro só
// existe enquanto `usuario` é null (ver o Stack.Protected no layout raiz).
//
// Sem esta configuração a primeira tela seria a primeira em ordem
// alfabética — "cadastro". Queremos abrir no login.
// (Em versões anteriores do Expo Router a chave chamava-se initialRouteName.)
export const unstable_settings = {
  anchor: 'login',
};

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        contentStyle: { backgroundColor: Colors.background },
      }}>
      <Stack.Screen name="login" options={{ title: 'Entrar' }} />
      <Stack.Screen name="cadastro" options={{ title: 'Criar conta' }} />
    </Stack>
  );
}
