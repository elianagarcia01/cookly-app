import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'RecipeDetail'>;

export default function RecipeDetailScreen({ route }: Props) {
  const { idMeal, strMeal } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{strMeal}</Text>
      <Text style={styles.sub}>{idMeal}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#fff', fontSize: 24 },
  sub: { color: '#888', fontSize: 14, marginTop: 8 },
});