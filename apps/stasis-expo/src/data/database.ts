import * as SQLite from 'expo-sqlite';

import { copyValidHistoryEndToken } from './history-policy';

const DATABASE_NAME = 'stasis.db';
const SCHEMA_VERSION = 2;

let databasePromise: Promise<SQLite.SQLiteDatabase> | undefined;
let initializationPromise: Promise<void> | undefined;

function database() {
  databasePromise ??= SQLite.openDatabaseAsync(DATABASE_NAME);
  return databasePromise;
}

export function initializeDatabase() {
  initializationPromise ??= initializeSchema().catch((error) => {
    initializationPromise = undefined;
    throw error;
  });
  return initializationPromise;
}

async function initializeSchema() {
  const db = await database();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS schema_meta (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      version INTEGER NOT NULL
    );
    INSERT OR IGNORE INTO schema_meta(id, version) VALUES (1, ${SCHEMA_VERSION});

    CREATE TABLE IF NOT EXISTS raw_records (
      counter INTEGER PRIMARY KEY,
      rec_ts INTEGER NOT NULL,
      payload BLOB NOT NULL,
      received_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS raw_records_rec_ts ON raw_records(rec_ts);

    CREATE TABLE IF NOT EXISTS sync_cursor (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      history_end_token BLOB NOT NULL,
      committed_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS day_result (
      day_id TEXT NOT NULL,
      algo_version INTEGER NOT NULL,
      partial INTEGER NOT NULL DEFAULT 1,
      result_json TEXT NOT NULL,
      PRIMARY KEY(day_id, algo_version)
    );

    CREATE TABLE IF NOT EXISTS metric_series (
      date TEXT NOT NULL,
      key TEXT NOT NULL,
      value REAL,
      PRIMARY KEY(date, key)
    );

    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS symptom_checkin (
      day_id TEXT PRIMARY KEY,
      status TEXT NOT NULL CHECK(status IN ('normal', 'off', 'sick')),
      symptoms_json TEXT NOT NULL DEFAULT '[]',
      severity INTEGER CHECK(severity IS NULL OR severity BETWEEN 1 AND 3),
      onset_at INTEGER,
      temperature_c REAL,
      test_status TEXT CHECK(test_status IS NULL OR test_status IN ('not_tested', 'negative', 'positive')),
      confounders_json TEXT NOT NULL DEFAULT '[]',
      note TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS symptom_checkin_updated_at ON symptom_checkin(updated_at DESC);

    CREATE TABLE IF NOT EXISTS illness_signal_feedback (
      day_id TEXT PRIMARY KEY,
      detector_version INTEGER NOT NULL,
      state TEXT NOT NULL CHECK(state IN ('normal', 'watch', 'elevated')),
      score REAL,
      drivers_json TEXT NOT NULL DEFAULT '[]',
      user_label TEXT CHECK(user_label IS NULL OR user_label IN ('normal', 'off', 'sick')),
      computed_at INTEGER NOT NULL
    );

    UPDATE schema_meta SET version = ${SCHEMA_VERSION}
    WHERE id = 1 AND version < ${SCHEMA_VERSION};
  `);
}

export type HistoryRecord = {
  counter: number;
  recTs: number;
  payload: Uint8Array;
};

/**
 * The only safe handoff from BLE history ingestion to an ACK writer.
 * The exact eight-byte HISTORY_END token is returned only after every record
 * and the cursor commit in one exclusive transaction. Callers must never ACK
 * on rejection or manufacture a replacement token.
 */
export async function commitHistoryChunk(
  records: readonly HistoryRecord[],
  historyEndToken: Uint8Array,
) {
  const ackToken = copyValidHistoryEndToken(historyEndToken);
  const db = await database();
  const committedAt = Math.floor(Date.now() / 1000);

  await db.withExclusiveTransactionAsync(async (txn) => {
    for (const record of records) {
      await txn.runAsync(
        `INSERT OR REPLACE INTO raw_records(counter, rec_ts, payload, received_at)
         VALUES (?, ?, ?, ?)`,
        record.counter,
        record.recTs,
        record.payload,
        committedAt,
      );
    }
    await txn.runAsync(
      `INSERT OR REPLACE INTO sync_cursor(id, history_end_token, committed_at)
       VALUES (1, ?, ?)`,
      historyEndToken,
      committedAt,
    );
  });

  return ackToken;
}

export async function setSetting(key: string, value: string) {
  await initializeDatabase();
  const db = await database();
  await db.runAsync(
    'INSERT OR REPLACE INTO app_settings(key, value) VALUES (?, ?)',
    key,
    value,
  );
}

export async function getSetting(key: string) {
  await initializeDatabase();
  const db = await database();
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_settings WHERE key = ?',
    key,
  );
  return row?.value ?? null;
}

export async function getLocalDatabase() {
  await initializeDatabase();
  return database();
}
