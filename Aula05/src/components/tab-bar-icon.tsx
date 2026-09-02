import { StyleSheet, Text, type ColorValue } from 'react-native';

interface TabBarIconProps {
  // Emoji usado como ícone. Em um projeto real, use @expo/vector-icons
  // ou expo-symbols; aqui o emoji evita uma dependência nova na aula.
  simbolo: string;
  color: ColorValue;
  focused: boolean;
}

export function TabBarIcon({ simbolo, color, focused }: TabBarIconProps) {
  return <Text style={[styles.icone, { color }, focused && styles.focado]}>{simbolo}</Text>;
}

const styles = StyleSheet.create({
  icone: {
    fontSize: 20,
    opacity: 0.6,
  },
  focado: {
    opacity: 1,
  },
});
