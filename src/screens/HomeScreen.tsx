import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import categoryTranslations from '../constants/categoryTranslations';
import { useNavigation } from '@react-navigation/native';
import { searchMeals, fetchCategories, fetchMealsByCategory } from '../services/mealDbApi';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useTheme } from '../theme/ThemeContext';

const TOP_CATEGORIES = ['Beef', 'Chicken', 'Pasta', 'Seafood', 'Dessert'];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { isConnected } = useNetworkStatus();
  const colors = useTheme();
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const categoryOrder = ['Breakfast', 'Starter', 'Pasta', 'Beef', 'Chicken', 'Seafood', 'Pork', 'Lamb', 'Goat', 'Side', 'Vegan', 'Vegetarian', 'Miscellaneous', 'Dessert'];

  const fetchCategoriesData = async () => {
    try {
      const data = await fetchCategories();
      const ordered = categoryOrder
        .map((name: string) => data.find((c: any) => c.strCategory === name))
        .filter(Boolean);
      const rest = data.filter((c: any) => !categoryOrder.includes(c.strCategory));
      setCategories([...ordered, ...rest]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllMeals = async () => {
    try {
      setLoading(true);
      const meals = await searchMeals();
      setMeals(meals);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMealsByCategoryData = async (category: string) => {
    try {
      setLoading(true);
      const meals = await fetchMealsByCategory(category);
      setMeals(meals);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const prefetchTopCategories = () => {
    TOP_CATEGORIES.forEach(category => {
      fetchMealsByCategory(category).catch(() => {});
    });
  };

  useEffect(() => {
    fetchAllMeals();
    fetchCategoriesData();
    prefetchTopCategories();
  }, []);

  const renderMeal = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate('RecipeDetail', { idMeal: item.idMeal, strMeal: item.strMeal })}>
      <Image source={{ uri: item.strMealThumb }} style={styles.image} />
      <Text style={[styles.cardTitle, { color: colors.text }]}>{item.strMeal}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      data={meals.filter((item: any) => item.strMeal.toLowerCase().includes(searchText.toLowerCase()))}
      keyExtractor={(item: any) => item.idMeal.toString()}
      numColumns={2}
      renderItem={renderMeal}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={
        loading ? <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} /> : null
      }
      ListHeaderComponent={
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Descubre Recetas</Text>

          {!isConnected && (
            <View style={styles.offlineBanner}>
              <Text style={styles.offlineText}>Sin conexión a internet</Text>
            </View>
          )}

          <View style={[styles.searchRow, { backgroundColor: colors.inputBackground }]}>
            <TextInput
              placeholder="Buscar recetas..."
              style={[styles.search, { color: colors.text }]}
              placeholderTextColor={colors.textSecondary}
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Text style={[styles.clearIcon, { color: colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.strCategory}
                style={[
                  styles.category,
                  { backgroundColor: colors.categoryBackground },
                  selectedCategory === cat.strCategory && styles.categorySelected,
                ]}
                onPress={() => {
                  if (selectedCategory === cat.strCategory) {
                    setSelectedCategory(null);
                    fetchAllMeals();
                  } else {
                    setSelectedCategory(cat.strCategory);
                    fetchMealsByCategoryData(cat.strCategory);
                  }
                }}>
                <Text style={{ color: colors.text }}>
                  {categoryTranslations[cat.strCategory]?.emoji} {categoryTranslations[cat.strCategory]?.label || cat.strCategory}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {selectedCategory
                ? categoryTranslations[selectedCategory]?.label || selectedCategory
                : 'Recetas Populares'}
            </Text>
          </View>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  searchRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, marginBottom: 15, paddingHorizontal: 12 },
  search: { flex: 1, padding: 12 },
  clearIcon: { fontSize: 16, padding: 4 },
  category: { padding: 12, borderRadius: 12, marginRight: 10 },
  categorySelected: { backgroundColor: '#FFD166' },
  section: { marginTop: 20, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  card: { flex: 1, margin: 6, borderRadius: 12, overflow: 'hidden' },
  image: { width: '100%', height: 120 },
  cardTitle: { padding: 10, fontWeight: '600' },
  offlineBanner: { backgroundColor: '#ff4444', borderRadius: 8, padding: 10, marginBottom: 12 },
  offlineText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
