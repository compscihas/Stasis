import type { DailySnapshot, SleepSegment, WorkoutSummary } from '@/domain/models';

export const previewSnapshot: DailySnapshot = {
  date: '2026-08-03',
  readiness: 72,
  strain: 9.4,
  sleepMinutes: 432,
  sleepEfficiency: 91,
  hrv: 82,
  restingHeartRate: 60,
  stress: 22,
  steps: 7482,
  calories: 1840,
};

export const previewSleep: SleepSegment[] = [
  { stage: 'awake', minutes: 18 },
  { stage: 'rem', minutes: 104 },
  { stage: 'light', minutes: 247 },
  { stage: 'deep', minutes: 63 },
];

export const previewWorkouts: WorkoutSummary[] = [
  {
    id: 'preview-run',
    type: 'Outdoor run',
    durationMinutes: 42,
    strain: 9.4,
    calories: 438,
  },
];

export const hrvTrend = [74, 78, 72, 81, 79, 85, 82];
export const restingHeartRateTrend = [63, 61, 62, 60, 59, 60, 60];

// One preview sample per hour, from midnight through the current midnight boundary.
export const heartRate24Hour = [
  62, 59, 57, 55, 54, 56, 61, 72, 84, 78, 69, 65, 63,
  67, 74, 82, 77, 71, 68, 73, 88, 79, 70, 66, 64,
];

export const currentHeartRate = heartRate24Hour[heartRate24Hour.length - 1] ?? null;
