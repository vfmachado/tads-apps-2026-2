// Em versões antigas o import era `import { Tabs } from 'expo-router'`.
// A partir do SDK 57 esse caminho está depreciado em favor de
// 'expo-router/js-tabs' (as abas desenhadas em JavaScript, iguais nas duas
// plataformas). Os dois ainda funcionam.
import { Tabs } from 'expo-router/js-tabs';

import { TabBarIcon } from '@/components/tab-bar-icon';
import { Colors } from '@/constants/theme';
import { CATEGORIAS } from '@/models/tarefa';

// LAYOUT DAS ABAS — src/app/(tabs)/_layout.tsx
//
// Os parênteses em (tabs) criam um GRUPO: a pasta organiza os arquivos, mas
// não aparece na URL. A tela src/app/(tabs)/index.tsx é a rota "/", e
// src/app/(tabs)/ajustes.tsx é "/ajustes".
//
// Diferença para o Stack: as abas são IRMÃS, não empilhadas. Trocar de aba
// não cria histórico e não desmonta a aba anterior — o estado dela continua
// vivo (teste: marque um interruptor em Ajustes, vá para Tarefas e volte).
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        sceneStyle: { backgroundColor: Colors.background },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tarefas',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon simbolo="🗒️" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explorar"
        options={{
          title: 'Explorar',
          // Um selo na aba — útil para contagens.
          tabBarBadge: CATEGORIAS.length,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon simbolo="🧭" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="ajustes"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon simbolo="⚙️" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
