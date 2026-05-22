import { open } from '@op-engineering/op-sqlite';

const DB_NAME = 'cookly.db';

export const db = open({ name: DB_NAME });

export const initDatabase = (): void => {
  db.execute(`
    CREATE TABLE IF NOT EXISTS FAVORITE (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      idMeal    TEXT NOT NULL UNIQUE,
      strMeal   TEXT NOT NULL,
      strCategory TEXT,
      strMealThumb TEXT,
      savedAt   INTEGER NOT NULL
    );
  `);
};