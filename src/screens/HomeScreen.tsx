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

export default function HomeScreen() {
  const [meals, setMeals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { label: 'Pollo 🍗', value: 'Chicken' },
    { label: 'Carne 🥩', value: 'Beef' },
    { label: 'Mariscos 🐟', value: 'Seafood' },
    { label: 'Postres 🍰', value: 'Dessert' },
  ];

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
  }, []);

  const renderMeal = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.strMealThumb }} style={styles.image} />
      <Text style={styles.cardTitle}>{item.strMeal}</Text>
    </View>
  );

  return (
    <FlatList
      data={meals}
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
          />

          {/* 🍽️ Categorías */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.category,
                  selectedCategory === cat.value && styles.categorySelected,
                ]}
                onPress={() => {
                  if (selectedCategory === cat.value) {
                    // 🔁 Si vuelve a tocar → resetear
                    setSelectedCategory(null);
                    fetchAllMeals();
                  } else {
                    setSelectedCategory(cat.value);
                    fetchMealsByCategory(cat.value);
                  }
                }}
              >
                <Text>{cat.label}</Text>
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