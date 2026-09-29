import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Header } from '@/components/header';
import { MenuLink } from '@/components/menu-link';
import { Note } from '@/components/note';
import { PrimaryButton } from '@/components/primary-button';
import { SessaoAtual } from '@/components/sessao-atual';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';

// TELA INICIAL — src/app/(app)/index.tsx  ->  rota "/"
//
// Só renderiza com alguém logado (garantido pelo layout raiz). Por isso
// `usuario` aqui nunca é null na prática — mas o tipo continua sendo
// `Usuario | null`, e o TypeScript pede o tratamento.
export default function InicioScreen() {
  const { usuario } = useAuth();
  const router = useRouter();

  if (!usuario) return null;

  const admin = usuario.papel === 'admin';

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <Header title={`Olá, ${usuario.nome}`} subtitle={`Você entrou como ${usuario.papel}`} />

      <Note>
        O nome acima veio do contexto, não de uma prop nem de um parâmetro de
        rota. Qualquer tela pode chamar useAuth() e ler o mesmo usuário.
      </Note>

      <View style={styles.grupo}>
        <Text style={styles.rotulo}>Rotas disponíveis para você</Text>
        <MenuLink
          href="/anotacoes"
          emoji="📝"
          title="Minhas anotações"
          description="Lista buscada no servidor com o seu token."
        />
        <MenuLink
          href="/perfil"
          emoji="👤"
          title="Perfil"
          description="Dados da sessão e o botão de sair."
        />
        {/* O menu decide o que MOSTRAR; o layout decide o que EXISTE.
            As duas decisões leem o mesmo `usuario` do contexto. */}
        {admin ? (
          <MenuLink
            href="/admin"
            emoji="🛡️"
            title="Administração"
            description="Todos os usuários cadastrados. Só para admin."
          />
        ) : null}
      </View>

      {!admin ? (
        <View style={styles.grupo}>
          <Text style={styles.rotulo}>Rota protegida</Text>
          <PrimaryButton
            label="Tentar abrir /admin mesmo assim"
            variant="secondary"
            // A rota existe no arquivo (src/app/(app)/admin.tsx), mas o
            // Stack.Protected do layout a removeu para este usuário. O
            // Expo Router redireciona para a primeira rota disponível.
            onPress={() => router.push('/admin')}
          />
          <Note>
            Entre como Administrador para ver a rota aparecer no menu — e para
            este botão deixar de fazer sentido.
          </Note>
        </View>
      ) : null}

      <SessaoAtual />
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
