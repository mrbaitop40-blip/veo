import Dexie, { Table } from 'dexie';

// FIX: Define the database schema on an untyped Dexie instance before casting
// to the typed interface. This ensures the `version` method is available during
// setup and resolves the "Property 'version' does not exist" error.
export interface IHistoryDB extends Dexie {
  videos: Table<Blob, string>;
  images: Table<Blob, string>;
}

const dbInstance = new Dexie('VEO-HistoryDB');

dbInstance.version(1).stores({
  videos: '', // Defines a simple key-value table where the key is passed externally.
});

dbInstance.version(2).stores({
  videos: '', // Re-declare 'videos' table from version 1.
  images: '', // Add new 'images' table.
});

export const db = dbInstance as IHistoryDB;
