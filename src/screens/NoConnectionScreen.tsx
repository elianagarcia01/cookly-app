import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { darkColors, lightColors } from '../theme/colors';

interface Props {
  onRetry: () => void;
}

export default function NoConnectionScreen({ onRetry }: Props) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.emoji}>📡</Text>
      <Text style={[styles.title, { color: colors.text }]}>Sin conexión a internet</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Revisá tu conexión e intentá de nuevo</Text>
      <TouchableOpacity style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emoji: { fontSize: 64, marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 15, marginBottom: 32, textAlign: 'center' },
  button: { backgroundColor: '#E07B39', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
