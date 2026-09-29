import { Stack } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';

// LAYOUT DO GRUPO (app) — src/app/(app)/_layout.tsx
//
// Tudo aqui dentro já está protegido pelo layout raiz: se este componente
// renderiza, existe um usuário logado.
//
// Mas "logado" não é a única pergunta. A tela de administração depende de
// QUEM está logado — e a resposta também está no contexto. O mesmo
// Stack.Protected, com outra condição.
export default function AppLayout() {
  const { usuario } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        contentStyle: { backgroundColor: Colors.background },
      }}>
      <Stack.Screen name="index" options={{ title: 'Início' }} />
      <Stack.Screen name="anotacoes" options={{ title: 'Minhas anotações' }} />
      <Stack.Screen name="perfil" options={{ title: 'Perfil' }} />

      {/* Para quem não é admin, esta rota simplesmente não existe:
          router.push('/admin') leva de volta ao início. O servidor confere
          de novo (403) — a proteção no app é só para a interface. */}
      <Stack.Protected guard={usuario?.papel === 'admin'}>
        <Stack.Screen name="admin" options={{ title: 'Administração' }} />
      </Stack.Protected>
    </Stack>
  );
}
