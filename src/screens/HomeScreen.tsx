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

  useEffect(() => {
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
      .then(res => res.json())
      .then(data => setMeals(data.meals || []))
      .catch(err => console.log(err));
  }, []);

  const renderMeal = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.strMealThumb }} style={styles.image} />
      <Text style={styles.cardTitle}>{item.strMeal}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Descubre Recetas</Text>

      {/* 🔍 Buscador */}
      <TextInput
        placeholder="Buscar recetas..."
        style={styles.search}
        placeholderTextColor="#999"
      />

      {/* 🍽️ Categorías */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {['Desayuno', 'Almuerzo', 'Cena', 'Postres'].map(cat => (
          <TouchableOpacity key={cat} style={styles.category}>
            <Text>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ⭐ Recetas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recetas Populares</Text>
      </View>

      <FlatList
        data={meals}
        renderItem={renderMeal}
        keyExtractor={(item: any) => item.idMeal}
        numColumns={2}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },

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