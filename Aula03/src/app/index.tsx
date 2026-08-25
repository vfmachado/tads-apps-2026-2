import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Header } from '@/components/header';
import { MenuLink } from '@/components/menu-link';
import { Colors, Spacing } from '@/constants/theme';
import { useState } from 'react';

export default function MenuScreen() {
  const [value, setValue] = useState(0);
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Header
        title="Estado (state)"
        subtitle="Três formas de controlar os dados de um formulário"
      />

    <View>
      <Pressable onPress={(e) => {
        console.log(
          "CLICOU " + value
        )
        setValue(value+1);
        
      }}>
        <Text>{value}</Text>
      </Pressable>
    </View>

      <View style={styles.list}>
        <MenuLink
          href="/estado-simples"
          step="1"
          title="Vários useState"
          description="Um useState para cada campo — simples, mas repetitivo."
        />
        <MenuLink
          href="/cadastro-objeto"
          step="2"
          title="Estado em objeto"
          description="Um único useState com todos os campos do cadastro."
        />
        <MenuLink
          href="/cadastro-formik"
          step="3"
          title="Formik"
          description="O mesmo cadastro, com a biblioteca cuidando do estado."
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  list: {
    gap: Spacing.sm,
  },
});
