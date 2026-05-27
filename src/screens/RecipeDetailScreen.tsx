import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { saveFavorite, removeFavorite, isFavorite, getFavorites } from '../database/favoritesRepository';

import categoryTranslations from '../constants/categoryTranslations';
import areaTranslations from '../constants/areaTranslations';

type Props = NativeStackScreenProps<RootStackParamList, 'RecipeDetail'>;

export default function RecipeDetailScreen({ route }: Props) {
  const { idMeal, strMeal } = route.params;
  const [meal, setMeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');

  useEffect(() => {
  fetchMealDetail();
  isFavorite(idMeal).then(setFavorite);
  }, []);

  const fetchMealDetail = async () => {
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
      const data = await res.json();
      setMeal(data.meals[0]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getIngredients = () => {
    if (!meal) return [];
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push({ ingredient, measure });
      }
    }
    return ingredients;
  };

  const toggleFavorite = async () => {
  if (favorite) {
    removeFavorite(idMeal);
    setFavorite(false);
  } else {
    saveFavorite({
      idMeal,
      strMeal,
      strCategory: meal?.strCategory || '',
      strMealThumb: meal?.strMealThumb || '',
    });
    setFavorite(true);
  }
};

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#E07B39" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Imagen */}
        <Image source={{ uri: meal?.strMealThumb }} style={styles.image} />

        {/* Categoría */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {/*categoryTranslations[meal?.strCategory]?.emoji*/}{categoryTranslations[meal?.strCategory]?.label || meal?.strCategory}
          </Text>
        </View>

        {/* Nombre */}
        <View style={styles.header}>
          <Text style={styles.title}>{meal?.strMeal}</Text>
        </View>

        {/* Info */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoEmoji}>⏱️</Text>
            <Text style={styles.infoLabel}>30 min</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoEmoji}>👥</Text>
            <Text style={styles.infoLabel}>4 personas</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoEmoji}>📍</Text>
            <Text style={styles.infoLabel}>{meal?.strArea}</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'ingredients' && styles.tabActive]}
            onPress={() => setActiveTab('ingredients')}>
            <Text style={[styles.tabText, activeTab === 'ingredients' && styles.tabTextActive]}>
              Ingredientes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'instructions' && styles.tabActive]}
            onPress={() => setActiveTab('instructions')}>
            <Text style={[styles.tabText, activeTab === 'instructions' && styles.tabTextActive]}>
              Preparación
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contenido tabs */}
        {activeTab === 'ingredients' ? (
          <View style={styles.content}>
            {getIngredients().map((item, index) => (
              <View key={index} style={styles.ingredientRow}>
                <Text style={styles.ingredientDot}>●</Text>
                <Text style={styles.ingredientName}>{item.ingredient}</Text>
                <Text style={styles.ingredientMeasure}>{item.measure}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.content}>
            {meal?.strInstructions?.split('\n').filter((s: string) => s.trim()).map((step: string, index: number) => (
              <View key={index} style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Botón favorito */}
      <TouchableOpacity style={styles.favoriteBtn} onPress={toggleFavorite}>
        <Text style={styles.favoriteBtnText}>
          {favorite ? '❤️ Guardado en Favoritos' : '🤍 Guardar en Favoritos'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 250 },
  categoryBadge: {
    position: 'absolute', top: 210, left: 16,
    backgroundColor: '#E07B39', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4,
  },
  categoryText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  header: { padding: 16, paddingBottom: 8 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1a1a1a' },
  infoRow: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 16 },
  infoItem: { flex: 1, alignItems: 'center' },
  infoEmoji: { fontSize: 20 },
  infoLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  tabs: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 8, backgroundColor: '#f0f0f0', borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tabText: { color: '#888', fontWeight: '600' },
  tabTextActive: { color: '#E07B39' },
  content: { padding: 16 },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  ingredientDot: { color: '#E07B39', marginRight: 8 },
  ingredientName: { flex: 1, fontSize: 15, color: '#1a1a1a' },
  ingredientMeasure: { fontSize: 14, color: '#888' },
  stepRow: { flexDirection: 'row', marginBottom: 16 },
  stepNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E07B39', justifyContent: 'center', alignItems: 'center', marginRight: 12, marginTop: 2 },
  stepNumberText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  stepText: { flex: 1, fontSize: 15, color: '#333', lineHeight: 22 },
  favoriteBtn: { margin: 16, backgroundColor: '#E07B39', borderRadius: 16, padding: 16, alignItems: 'center' },
  favoriteBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});