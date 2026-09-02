import { useRouter, type Href } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Header } from '@/components/header';
import { LinhaConfig } from '@/components/linha-config';
import { MenuLink } from '@/components/menu-link';
import { Note } from '@/components/note';
import { PrimaryButton } from '@/components/primary-button';
import { Colors, Spacing } from '@/constants/theme';

// TELA 3 — src/app/(tabs)/ajustes.tsx  ->  rota "/ajustes"
//
// Configurações. Serve também de menu para as demais rotas do projeto:
// o modal, o laboratório da pilha, o mapa de rotas e uma rota inexistente.
export default function AjustesScreen() {
  const router = useRouter();

  // Estado local da aba. Troque de aba e volte: ele continua aqui, porque as
  // abas não são desmontadas ao perder o foco (diferente de uma pilha, onde
  // a tela removida some de vez).
  const [notificacoes, setNotificacoes] = useState(true);
  const [modoCompacto, setModoCompacto] = useState(false);

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <Header title="Ajustes" subtitle="Preferências e atalhos para as outras rotas" />

      <View style={styles.grupo}>
        <Text style={styles.rotulo}>Preferências</Text>
        <LinhaConfig
          titulo="Notificações"
          descricao="Avisar quando um prazo estiver perto"
          valor={notificacoes}
          onChange={setNotificacoes}
        />
        <LinhaConfig
          titulo="Modo compacto"
          descricao="Mostrar mais itens por tela"
          valor={modoCompacto}
          onChange={setModoCompacto}
        />
        <Note>
          Mude um interruptor, vá até a aba Tarefas e volte: o valor continua
          aqui. As abas trocam de foco, mas não descartam a tela.
        </Note>
      </View>

      <View style={styles.grupo}>
        <Text style={styles.rotulo}>Rotas do projeto</Text>
        <MenuLink
          href="/sobre"
          emoji="ℹ️"
          title="Sobre o app"
          description="Abre como modal — configurado no layout raiz, não na tela."
        />
        <MenuLink
          href={{ pathname: '/pilha', params: { nivel: '1' } }}
          emoji="🧪"
          title="Laboratório da pilha"
          description="push, replace, navigate, back e dismissAll lado a lado."
        />
        <MenuLink
          href="/_sitemap"
          emoji="🗺️"
          title="Mapa de rotas"
          description="Tela pronta do Expo Router com todas as rotas do app."
        />
      </View>

      <View style={styles.grupo}>
        <Text style={styles.rotulo}>Rota inexistente</Text>
        <PrimaryButton
          label="Ir para /configuracoes/tema"
          variant="secondary"
          // Nenhum arquivo corresponde a esse caminho, então o Expo Router
          // cai na rota +not-found.tsx. O `as Href` só existe porque o app
          // usa typedRoutes: o TypeScript JÁ sabe que essa rota não existe e
          // recusaria a linha sem o cast.
          onPress={() => router.push('/configuracoes/tema' as Href)}
        />
      </View>
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
  grupo: {
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
