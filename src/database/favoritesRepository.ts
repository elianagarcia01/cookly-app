import { db } from './database';

export interface Favorite {
  id?: number;
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strMealThumb: string;
  savedAt: number;
}

export const saveFavorite = (recipe: Omit<Favorite, 'id' | 'savedAt'>): void => {
  console.log('Intentando guardar:', recipe);
  db.execute(
    `INSERT OR IGNORE INTO FAVORITE (idMeal, strMeal, strCategory, strMealThumb, savedAt)
     VALUES (?, ?, ?, ?, ?);`,
    [recipe.idMeal, recipe.strMeal, recipe.strCategory, recipe.strMealThumb, Date.now()]
  );
  console.log('Guardado exitoso');
};

export const removeFavorite = (idMeal: string): void => {
  db.execute(`DELETE FROM FAVORITE WHERE idMeal = ?;`, [idMeal]);
};

export const getFavorites = async (): Promise<Favorite[]> => {
  const result = await db.execute(`SELECT * FROM FAVORITE ORDER BY savedAt DESC;`);
  console.log('Result:', JSON.stringify(result));
  return (result.rows as any) ?? [];
};

export const isFavorite = async (idMeal: string): Promise<boolean> => {
  const result = await db.execute(
    `SELECT id FROM FAVORITE WHERE idMeal = ?;`,
    [idMeal]
  );
  return ((result.rows as any) ?? []).length > 0;
};