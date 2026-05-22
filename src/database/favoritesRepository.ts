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
  db.execute(
    `INSERT OR IGNORE INTO FAVORITE (idMeal, strMeal, strCategory, strMealThumb, savedAt)
     VALUES (?, ?, ?, ?, ?);`,
    [recipe.idMeal, recipe.strMeal, recipe.strCategory, recipe.strMealThumb, Date.now()]
  );
};

export const removeFavorite = (idMeal: string): void => {
  db.execute(`DELETE FROM FAVORITE WHERE idMeal = ?;`, [idMeal]);
};

export const getFavorites = (): Favorite[] => {
  const result = db.execute(`SELECT * FROM FAVORITE ORDER BY savedAt DESC;`);
  return (result.rows?._array ?? []) as Favorite[];
};

export const isFavorite = (idMeal: string): boolean => {
  const result = db.execute(
    `SELECT id FROM FAVORITE WHERE idMeal = ?;`,
    [idMeal]
  );
  return (result.rows?._array ?? []).length > 0;
};