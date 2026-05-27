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

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [meals, setMeals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const categoryOrder = ['Breakfast', 'Starter', 'Pasta', 'Beef', 'Chicken', 'Seafood', 'Pork', 'Lamb', 'Goat', 'Side', 'Vegan', 'Vegetarian', 'Miscellaneous', 'Dessert'];

const fetchCategories = async () => {
  try {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
    const data = await res.json();
    const ordered = categoryOrder
      .map(name => data.categories.find((c: any) => c.strCategory === name))
      .filter(Boolean);
    const rest = data.categories.filter((c: any) => !categoryOrder.includes(c.strCategory));
    setCategories([...ordered, ...rest]);
  } catch (error) {
    console.log(error);
  }
};

  // 🔎 Traer todas las recetas (home inicial)
  const fetchAllMeals = async () => {
    try {
      const res = await fetch(
        'https://www.themealdb.com/api/json/v1/1/search.php?s='
      );
      const data = await res.json();
      setMeals(data.meals || []);
    } catch (error) {
      console.log(error);
    }
  };

  // 🍽️ Filtrar por categoría
  const fetchMealsByCategory = async (category: string) => {
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
      );
      const data = await res.json();
      setMeals(data.meals || []);
    } catch (error) {
      console.log(error);
    }
  };

  // 🚀 Al iniciar → sin filtro
useEffect(() => {
  fetchAllMeals();
  fetchCategories();
}, []);

  const renderMeal = ({ item }: any) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RecipeDetail', { idMeal: item.idMeal, strMeal: item.strMeal })}>
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

          {/* 🔍 Buscador */}
          <TextInput
            placeholder="Buscar recetas..."
            style={styles.search}
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />

          {/* 🍽️ Categorías */}
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
                    // 🔁 Si vuelve a tocar → resetear
                    setSelectedCategory(null);
                    fetchAllMeals();
                  } else {
                    setSelectedCategory(cat.strCategory);
                    fetchMealsByCategory(cat.strCategory);
                  }
                }}
              >
                <Text>
                  {categoryTranslations[cat.strCategory]?.emoji} {categoryTranslations[cat.strCategory]?.label || cat.strCategory}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ⭐ Título dinámico en español */}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  search: {
    backgroundColor: '#EAEAEA',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },

  category: {
    backgroundColor: '#EDE0D4',
    padding: 12,
    borderRadius: 12,
    marginRight: 10,
  },

  categorySelected: {
    backgroundColor: '#FFD166',
  },

  section: {
    marginTop: 20,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  card: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: 120,
  },

  cardTitle: {
    padding: 10,
    fontWeight: '600',
  },
});