const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const searchMeals = async (query: string = '') => {
  const res = await fetch(`${BASE_URL}/search.php?s=${query}`);
  const data = await res.json();
  return data.meals || [];
};

export const fetchCategories = async () => {
  const res = await fetch(`${BASE_URL}/categories.php`);
  const data = await res.json();
  return data.categories || [];
};

export const fetchMealsByCategory = async (category: string) => {
  const res = await fetch(`${BASE_URL}/filter.php?c=${category}`);
  const data = await res.json();
  return data.meals || [];
};

export const fetchMealById = async (idMeal: string) => {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${idMeal}`);
  const data = await res.json();
  return data.meals?.[0] || null;
};