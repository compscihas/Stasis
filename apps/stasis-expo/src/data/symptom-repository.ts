import { getLocalDatabase } from '@/data/database';
import type { ConfounderId, FeelingStatus, IllnessSignal, SymptomCheckin, SymptomId, TestStatus } from '@/data/symptom-model';

type CheckinRow = {
  day_id: string;
  status: FeelingStatus;
  symptoms_json: string;
  severity: 1 | 2 | 3 | null;
  onset_at: number | null;
  temperature_c: number | null;
  test_status: TestStatus | null;
  confounders_json: string;
  note: string | null;
  created_at: number;
  updated_at: number;
};

type SignalRow = {
  day_id: string;
  detector_version: number;
  state: IllnessSignal['state'];
  score: number | null;
  drivers_json: string;
  user_label: FeelingStatus | null;
  computed_at: number;
};

export type SaveCheckinInput = Omit<SymptomCheckin, 'createdAt' | 'updatedAt'>;

function parseList<T extends string>(raw: string): T[] {
  try {
    const decoded: unknown = JSON.parse(raw);
    return Array.isArray(decoded) ? decoded.filter((item): item is T => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function checkinFromRow(row: CheckinRow): SymptomCheckin {
  return {
    dayId: row.day_id,
    status: row.status,
    symptoms: parseList<SymptomId>(row.symptoms_json),
    severity: row.severity,
    onsetAt: row.onset_at,
    temperatureC: row.temperature_c,
    testStatus: row.test_status,
    confounders: parseList<ConfounderId>(row.confounders_json),
    note: row.note ?? '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function saveSymptomCheckin(input: SaveCheckinInput) {
  const db = await getLocalDatabase();
  const now = Date.now();
  const symptoms = input.status === 'normal' ? [] : input.symptoms;
  const severity = input.status === 'normal' ? null : input.severity;
  const onsetAt = input.status === 'normal' ? null : input.onsetAt;
  const temperatureC = input.status === 'normal' ? null : input.temperatureC;
  const testStatus = input.status === 'normal' ? null : input.testStatus;
  await db.withExclusiveTransactionAsync(async (txn) => {
    await txn.runAsync(
      `INSERT INTO symptom_checkin(
        day_id, status, symptoms_json, severity, onset_at, temperature_c,
        test_status, confounders_json, note, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(day_id) DO UPDATE SET
        status = excluded.status,
        symptoms_json = excluded.symptoms_json,
        severity = excluded.severity,
        onset_at = excluded.onset_at,
        temperature_c = excluded.temperature_c,
        test_status = excluded.test_status,
        confounders_json = excluded.confounders_json,
        note = excluded.note,
        updated_at = excluded.updated_at`,
      input.dayId,
      input.status,
      JSON.stringify(symptoms),
      severity,
      onsetAt,
      temperatureC,
      testStatus,
      JSON.stringify(input.confounders),
      input.note.trim() || null,
      now,
      now,
    );
    await txn.runAsync(
      'UPDATE illness_signal_feedback SET user_label = ? WHERE day_id = ?',
      input.status,
      input.dayId,
    );
  });
  return getSymptomCheckin(input.dayId);
}

export async function getSymptomCheckin(dayId: string) {
  const db = await getLocalDatabase();
  const row = await db.getFirstAsync<CheckinRow>(
    'SELECT * FROM symptom_checkin WHERE day_id = ?',
    dayId,
  );
  return row ? checkinFromRow(row) : null;
}

export async function recentSymptomCheckins(limit = 30) {
  const db = await getLocalDatabase();
  const rows = await db.getAllAsync<CheckinRow>(
    'SELECT * FROM symptom_checkin ORDER BY day_id DESC LIMIT ?',
    Math.max(1, Math.min(365, limit)),
  );
  return rows.map(checkinFromRow);
}

export async function recordIllnessSignal(signal: Omit<IllnessSignal, 'userLabel'>) {
  const db = await getLocalDatabase();
  await db.runAsync(
    `INSERT OR REPLACE INTO illness_signal_feedback(
      day_id, detector_version, state, score, drivers_json, user_label, computed_at
    ) VALUES (?, ?, ?, ?, ?, (SELECT status FROM symptom_checkin WHERE day_id = ?), ?)`,
    signal.dayId,
    signal.detectorVersion,
    signal.state,
    signal.score,
    JSON.stringify(signal.drivers),
    signal.dayId,
    signal.computedAt,
  );
}

export async function recentIllnessSignals(limit = 30) {
  const db = await getLocalDatabase();
  const rows = await db.getAllAsync<SignalRow>(
    'SELECT * FROM illness_signal_feedback ORDER BY day_id DESC LIMIT ?',
    Math.max(1, Math.min(365, limit)),
  );
  return rows.map((row): IllnessSignal => ({
    dayId: row.day_id,
    detectorVersion: row.detector_version,
    state: row.state,
    score: row.score,
    drivers: parseList<string>(row.drivers_json),
    userLabel: row.user_label,
    computedAt: row.computed_at,
  }));
}
