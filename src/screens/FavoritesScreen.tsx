import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  Image, TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getFavorites, removeFavorite, Favorite } from '../database/favoritesRepository';

import categoryTranslations from '../constants/categoryTranslations';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const navigation = useNavigation<any>();

  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        const data = await getFavorites();
        console.log('Favoritos cargados:', data);
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
      <View style={styles.empty}>
        <Text style={styles.emptyEmoji}>🤍</Text>
        <Text style={styles.emptyText}>No tenés recetas guardadas</Text>
        <Text style={styles.emptySubText}>Explorá recetas y guardalas aquí</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Favoritos</Text>
      <Text style={styles.subtitle}>❤️ {favorites.length} recetas guardadas</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardContent}
              onPress={() => navigation.navigate('RecipeDetail', { idMeal: item.idMeal, strMeal: item.strMeal })}>
              <Image source={{ uri: item.strMealThumb }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.strMeal}</Text>
                <Text style={styles.category}>{categoryTranslations[item.strCategory]?.label || item.strCategory}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item.idMeal)}>
                <Text style={styles.removeBtnText}>🗑️ Eliminar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.viewBtn} onPress={() => navigation.navigate('RecipeDetail', { idMeal: item.idMeal, strMeal: item.strMeal })}>
                <Text style={styles.viewBtnText}>Ver receta</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 16 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  emptySubText: { fontSize: 14, color: '#888', marginTop: 8 },
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4 },
  cardContent: { flexDirection: 'row', padding: 12 },
  image: { width: 80, height: 80, borderRadius: 10 },
  info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a' },
  category: { fontSize: 13, color: '#888', marginTop: 4 },
  actions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  removeBtn: { flex: 1, padding: 12, alignItems: 'center', borderRightWidth: 1, borderRightColor: '#f0f0f0' },
  removeBtnText: { color: '#E07B39', fontWeight: '600' },
  viewBtn: { flex: 1, padding: 12, alignItems: 'center' },
  viewBtnText: { color: '#E07B39', fontWeight: '600' },
});