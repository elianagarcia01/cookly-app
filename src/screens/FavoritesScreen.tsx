import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  Image, TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getFavorites, removeFavorite, Favorite } from '../database/favoritesRepository';
import categoryTranslations from '../constants/categoryTranslations';
import { useTheme } from '../theme/ThemeContext';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const navigation = useNavigation<any>();
  const colors = useTheme();

  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        const data = await getFavorites();
        setFavorites(data);
      };
      loadFavorites();
    }, [])
  );

  const handleRemove = async (idMeal: string) => {
    removeFavorite(idMeal);
    const updatedFavorites = await getFavorites();
    setFavorites(updatedFavorites);
  };

  if (favorites.length === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.background }]}>
        <Text style={styles.emptyEmoji}>🤍</Text>
        <Text style={[styles.emptyText, { color: colors.text }]}>No tenés recetas guardadas</Text>
        <Text style={[styles.emptySubText, { color: colors.textSecondary }]}>Explorá recetas y guardalas aquí</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Mis Favoritos</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>❤️ {favorites.length} recetas guardadas</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <TouchableOpacity
              style={styles.cardContent}
              onPress={() => navigation.navigate('RecipeDetail', { idMeal: item.idMeal, strMeal: item.strMeal })}>
              <Image source={{ uri: item.strMealThumb }} style={styles.image} />
              <View style={styles.info}>
                <Text style={[styles.name, { color: colors.text }]}>{item.strMeal}</Text>
                <Text style={[styles.category, { color: colors.textSecondary }]}>{categoryTranslations[item.strCategory]?.label || item.strCategory}</Text>
              </View>
            </TouchableOpacity>
            <View style={[styles.actions, { borderTopColor: colors.border }]}>
              <TouchableOpacity style={[styles.removeBtn, { borderRightColor: colors.border }]} onPress={() => handleRemove(item.idMeal)}>
                <Text style={[styles.removeBtnText, { color: colors.primary }]}>🗑️ Eliminar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.viewBtn} onPress={() => navigation.navigate('RecipeDetail', { idMeal: item.idMeal, strMeal: item.strMeal })}>
                <Text style={[styles.viewBtnText, { color: colors.primary }]}>Ver receta</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 16 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: 'bold' },
  emptySubText: { fontSize: 14, marginTop: 8 },
  card: { borderRadius: 12, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4 },
  cardContent: { flexDirection: 'row', padding: 12 },
  image: { width: 80, height: 80, borderRadius: 10 },
  info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: 'bold' },
  category: { fontSize: 13, marginTop: 4 },
  actions: { flexDirection: 'row', borderTopWidth: 1 },
  removeBtn: { flex: 1, padding: 12, alignItems: 'center', borderRightWidth: 1 },
  removeBtnText: { fontWeight: '600' },
  viewBtn: { flex: 1, padding: 12, alignItems: 'center' },
  viewBtnText: { fontWeight: '600' },
});
