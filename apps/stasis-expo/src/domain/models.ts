export type DailySnapshot = {
  date: string;
  readiness: number | null;
  strain: number | null;
  sleepMinutes: number | null;
  sleepEfficiency: number | null;
  hrv: number | null;
  restingHeartRate: number | null;
  stress: number | null;
  steps: number | null;
  calories: number | null;
};

export type SleepStage = 'awake' | 'rem' | 'light' | 'deep';

export type SleepSegment = {
  stage: SleepStage;
  minutes: number;
};

export type WorkoutSummary = {
  id: string;
  type: string;
  durationMinutes: number;
  strain: number | null;
  calories: number | null;
};
