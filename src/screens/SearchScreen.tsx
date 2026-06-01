import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  FlatList, Image, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import categoryTranslations from '../constants/categoryTranslations';
import areaTranslations from '../constants/areaTranslations';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const isConnected = useNetworkStatus();
  const [query, setQuery] = useState('');
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchMeals = async (text: string) => {
    setQuery(text);
    if (text.length < 2) {
      setMeals([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${text}`);
      const data = await res.json();
      setMeals(data.meals || []);
      setSearched(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Banner sin conexión */}
      {!isConnected && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Sin conexión a internet</Text>
        </View>
      )}

      {/* Barra de búsqueda */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="Buscar recetas..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={searchMeals}
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setMeals([]); setSearched(false); }}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Loading */}
      {loading && <ActivityIndicator size="large" color="#E07B39" style={{ marginTop: 20 }} />}

      {/* Sin resultados */}
      {searched && !loading && meals.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🍽️</Text>
          <Text style={styles.emptyText}>No encontramos recetas para "{query}"</Text>
        </View>
      )}

      {/* Estado inicial */}
      {!searched && !loading && (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyText}>Buscá tus recetas favoritas</Text>
        </View>
      )}

      {/* Resultados */}
      {meals.length > 0 && (
        <>
          <Text style={styles.resultsText}>{meals.length} recetas encontradas para "{query}"</Text>
          <FlatList
            data={meals}
            keyExtractor={(item) => item.idMeal}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('RecipeDetail', { idMeal: item.idMeal, strMeal: item.strMeal })}>
                <Image source={{ uri: item.strMealThumb }} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.strMeal}</Text>
                  <Text style={styles.category}>{categoryTranslations[item?.strCategory]?.label || item?.strCategory}</Text>
                  <Text style={styles.area}>{item.strArea}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 12, paddingHorizontal: 12, marginBottom: 16 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  input: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#1a1a1a' },
  clearIcon: { fontSize: 16, color: '#888', padding: 4 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  emptyText: { fontSize: 16, color: '#888', textAlign: 'center' },
  resultsText: { fontSize: 13, color: '#888', marginBottom: 12 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, padding: 12 },
  image: { width: 80, height: 80, borderRadius: 10 },
  info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a' },
  category: { fontSize: 13, color: '#888', marginTop: 4 },
  area: { fontSize: 12, color: '#E07B39', marginTop: 2 },
  offlineBanner: { backgroundColor: '#ff4444', borderRadius: 8, padding: 10, marginBottom: 12 },
  offlineText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});