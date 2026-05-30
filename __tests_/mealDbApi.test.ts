import { searchMeals, fetchCategories, fetchMealsByCategory, fetchMealById } from '../src/services/mealDbApi';

global.fetch = jest.fn();

const mockFetch = (data: any) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    json: async () => data,
  });
};

describe('mealDbApi', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('searchMeals retorna lista de recetas', async () => {
    mockFetch({ meals: [{ idMeal: '1', strMeal: 'Pizza' }] });
    const result = await searchMeals('pizza');
    expect(result).toHaveLength(1);
    expect(result[0].strMeal).toBe('Pizza');
  });

  test('searchMeals retorna array vacío si no hay resultados', async () => {
    mockFetch({ meals: null });
    const result = await searchMeals('xyzxyz');
    expect(result).toEqual([]);
  });

  test('fetchCategories retorna lista de categorías', async () => {
    mockFetch({ categories: [{ strCategory: 'Beef' }, { strCategory: 'Chicken' }] });
    const result = await fetchCategories();
    expect(result).toHaveLength(2);
    expect(result[0].strCategory).toBe('Beef');
  });

  test('fetchMealsByCategory retorna recetas de la categoría', async () => {
    mockFetch({ meals: [{ idMeal: '2', strMeal: 'Tacos' }] });
    const result = await fetchMealsByCategory('Beef');
    expect(result).toHaveLength(1);
    expect(result[0].strMeal).toBe('Tacos');
  });

  test('fetchMealById retorna una receta por id', async () => {
    mockFetch({ meals: [{ idMeal: '52772', strMeal: 'Teriyaki Chicken' }] });
    const result = await fetchMealById('52772');
    expect(result).not.toBeNull();
    expect(result.strMeal).toBe('Teriyaki Chicken');
  });

  test('fetchMealById retorna null si no encuentra la receta', async () => {
    mockFetch({ meals: null });
    const result = await fetchMealById('99999');
    expect(result).toBeNull();
  });

});