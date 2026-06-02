const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

const cache: Record<string, any[]> = {};

export const searchMeals = async (query: string = '') => {
  const key = `search:${query}`;
  if (cache[key]) return cache[key];

  const res = await fetch(`${BASE_URL}/search.php?s=${query}`);
  const data = await res.json();
  cache[key] = data.meals || [];
  return cache[key];
};

export const fetchCategories = async () => {
  if (cache['categories']) return cache['categories'];

  const res = await fetch(`${BASE_URL}/categories.php`);
  const data = await res.json();
  cache['categories'] = data.categories || [];
  return cache['categories'];
};

export const fetchMealsByCategory = async (category: string) => {
  const key = `category:${category}`;
  if (cache[key]) return cache[key];

  const res = await fetch(`${BASE_URL}/filter.php?c=${category}`);
  const data = await res.json();
  cache[key] = data.meals || [];
  return cache[key];
};

export const fetchMealById = async (idMeal: string) => {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${idMeal}`);
  const data = await res.json();
  return data.meals?.[0] || null;
};
