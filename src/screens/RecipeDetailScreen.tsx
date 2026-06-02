import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView,
  TouchableOpacity, ActivityIndicator, Linking,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { saveFavorite, removeFavorite, isFavorite } from '../database/favoritesRepository';
import { Button } from 'react-native-paper';
import categoryTranslations from '../constants/categoryTranslations';
import { fetchMealById } from '../services/mealDbApi';
import { useTheme } from '../theme/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'RecipeDetail'>;

export default function RecipeDetailScreen({ route }: Props) {
  const { idMeal, strMeal } = route.params;
  const colors = useTheme();
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
      const meal = await fetchMealById(idMeal);
      setMeal(meal);
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
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#E07B39" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <Image source={{ uri: meal?.strMealThumb }} style={styles.image} />

        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {categoryTranslations[meal?.strCategory]?.label || meal?.strCategory}
          </Text>
        </View>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{meal?.strMeal}</Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoEmoji}>⏱️</Text>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>30 min</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoEmoji}>👥</Text>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>4 personas</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoEmoji}>📍</Text>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{meal?.strArea}</Text>
          </View>
        </View>

        <View style={[styles.tabs, { backgroundColor: colors.inputBackground }]}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'ingredients' && { backgroundColor: colors.card }]}
            onPress={() => setActiveTab('ingredients')}>
            <Text style={[styles.tabText, { color: colors.textSecondary }, activeTab === 'ingredients' && { color: colors.primary }]}>
              Ingredientes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'instructions' && { backgroundColor: colors.card }]}
            onPress={() => setActiveTab('instructions')}>
            <Text style={[styles.tabText, { color: colors.textSecondary }, activeTab === 'instructions' && { color: colors.primary }]}>
              Preparación
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'ingredients' ? (
          <View style={styles.content}>
            {getIngredients().map((item, index) => (
              <View key={index} style={[styles.ingredientRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.ingredientDot, { color: colors.primary }]}>●</Text>
                <Text style={[styles.ingredientName, { color: colors.text }]}>{item.ingredient}</Text>
                <Text style={[styles.ingredientMeasure, { color: colors.textSecondary }]}>{item.measure}</Text>
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
                <Text style={[styles.stepText, { color: colors.text }]}>{step}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {meal?.strYoutube ? (
        <Button
          mode="contained"
          buttonColor="#FF0000"
          textColor="#fff"
          style={{ marginHorizontal: 16, marginBottom: 8, borderRadius: 16 }}
          icon="play"
          onPress={() => Linking.openURL(meal.strYoutube)}>
          Ver en YouTube
        </Button>
      ) : null}

      <Button
        mode="contained"
        buttonColor="#E07B39"
        textColor="#fff"
        style={{ margin: 16, borderRadius: 16 }}
        icon={favorite ? 'heart' : 'heart-outline'}
        onPress={toggleFavorite}>
        {favorite ? 'Guardado en Favoritos' : 'Guardar en Favoritos'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 250 },
  categoryBadge: {
    position: 'absolute', top: 210, left: 16,
    backgroundColor: '#E07B39', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4,
  },
  categoryText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  header: { padding: 16, paddingBottom: 8 },
  title: { fontSize: 26, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 16 },
  infoItem: { flex: 1, alignItems: 'center' },
  infoEmoji: { fontSize: 20 },
  infoLabel: { fontSize: 12, marginTop: 4 },
  tabs: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabText: { fontWeight: '600' },
  content: { padding: 16 },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1 },
  ingredientDot: { marginRight: 8 },
  ingredientName: { flex: 1, fontSize: 15 },
  ingredientMeasure: { fontSize: 14 },
  stepRow: { flexDirection: 'row', marginBottom: 16 },
  stepNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E07B39', justifyContent: 'center', alignItems: 'center', marginRight: 12, marginTop: 2 },
  stepNumberText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  stepText: { flex: 1, fontSize: 15, lineHeight: 22 },
});
