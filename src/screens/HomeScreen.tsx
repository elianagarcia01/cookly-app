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
} from 'react-native';

import categoryTranslations from '../constants/categoryTranslations';
import { useNavigation } from '@react-navigation/native';
import { searchMeals, fetchCategories, fetchMealsByCategory } from '../services/mealDbApi';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const isConnected = useNetworkStatus();
  const [meals, setMeals] = useState([]);
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
      const meals = await searchMeals();
      setMeals(meals);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMealsByCategoryData = async (category: string) => {
    try {
      const meals = await fetchMealsByCategory(category);
      setMeals(meals);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllMeals();
    fetchCategoriesData();
  }, []);

  const renderMeal = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('RecipeDetail', { idMeal: item.idMeal, strMeal: item.strMeal })}>
      <Image source={{ uri: item.strMealThumb }} style={styles.image} />
      <Text style={styles.cardTitle}>{item.strMeal}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={meals.filter((item: any) => item.strMeal.toLowerCase().includes(searchText.toLowerCase()))}
      keyExtractor={(item: any) => item.idMeal.toString()}
      numColumns={2}
      renderItem={renderMeal}
      contentContainerStyle={{ padding: 16 }}
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>Descubre Recetas</Text>

          {/* Banner sin conexión */}
          {!isConnected && (
            <View style={styles.offlineBanner}>
              <Text style={styles.offlineText}>Sin conexión a internet</Text>
            </View>
          )}

          {/* Buscador */}
          <TextInput
            placeholder="Buscar recetas..."
            style={styles.search}
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />

          {/* Categorías */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.strCategory}
                style={[
                  styles.category,
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
                <Text>
                  {categoryTranslations[cat.strCategory]?.emoji} {categoryTranslations[cat.strCategory]?.label || cat.strCategory}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Título dinámico */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {selectedCategory
                ? categories.find(c => c.value === selectedCategory)?.label
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
  search: { backgroundColor: '#EAEAEA', borderRadius: 10, padding: 12, marginBottom: 15 },
  category: { backgroundColor: '#EDE0D4', padding: 12, borderRadius: 12, marginRight: 10 },
  categorySelected: { backgroundColor: '#FFD166' },
  section: { marginTop: 20, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  card: { flex: 1, backgroundColor: '#fff', margin: 6, borderRadius: 12, overflow: 'hidden' },
  image: { width: '100%', height: 120 },
  cardTitle: { padding: 10, fontWeight: '600' },
  offlineBanner: { backgroundColor: '#ff4444', borderRadius: 8, padding: 10, marginBottom: 12 },
  offlineText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});