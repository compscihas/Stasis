export const symptomOptions = [
  'sore_throat',
  'congestion',
  'cough',
  'headache',
  'fever_chills',
  'fatigue',
  'body_aches',
  'stomach',
] as const;

export const confounderOptions = [
  'hard_training',
  'alcohol',
  'travel',
  'poor_sleep',
  'medication',
  'high_stress',
] as const;

export type FeelingStatus = 'normal' | 'off' | 'sick';
export type SymptomId = (typeof symptomOptions)[number];
export type ConfounderId = (typeof confounderOptions)[number];
export type TestStatus = 'not_tested' | 'negative' | 'positive';
export type OnsetChoice = 'today' | 'yesterday' | 'unsure';

export type SymptomCheckin = {
  dayId: string;
  status: FeelingStatus;
  symptoms: SymptomId[];
  severity: 1 | 2 | 3 | null;
  onsetAt: number | null;
  temperatureC: number | null;
  testStatus: TestStatus | null;
  confounders: ConfounderId[];
  note: string;
  createdAt: number;
  updatedAt: number;
};

export type IllnessSignal = {
  dayId: string;
  detectorVersion: number;
  state: 'normal' | 'watch' | 'elevated';
  score: number | null;
  drivers: string[];
  userLabel: FeelingStatus | null;
  computedAt: number;
};

export function localDayId(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function normalizeTemperature(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 30 || parsed > 45) {
    throw new Error('Enter a temperature between 30 and 45 °C.');
  }
  return Math.round(parsed * 10) / 10;
}

export function onsetAtForChoice(choice: OnsetChoice, now = new Date()) {
  if (choice === 'unsure') return null;
  const onset = new Date(now);
  if (choice === 'yesterday') onset.setDate(onset.getDate() - 1);
  return onset.getTime();
}

export function summarizeCheckins(checkins: readonly SymptomCheckin[]) {
  const normalDays = checkins.filter((item) => item.status === 'normal').length;
  const symptomaticDays = checkins.length - normalDays;
  return {
    total: checkins.length,
    normalDays,
    symptomaticDays,
    hasBothLabels: normalDays > 0 && symptomaticDays > 0,
  };
}

export function evaluateSignalFeedback(
  checkins: readonly SymptomCheckin[],
  signals: readonly IllnessSignal[],
) {
  const labels = new Map(checkins.map((item) => [item.dayId, item.status]));
  let matched = 0;
  let usefulAlerts = 0;
  let falseAlerts = 0;
  let missedSymptomDays = 0;
  for (const signal of signals) {
    const label = labels.get(signal.dayId);
    if (!label) continue;
    matched++;
    const alerted = signal.state === 'elevated';
    const symptomatic = label !== 'normal';
    if (alerted && symptomatic) usefulAlerts++;
    if (alerted && !symptomatic) falseAlerts++;
    if (!alerted && symptomatic) missedSymptomDays++;
  }
  return { matched, usefulAlerts, falseAlerts, missedSymptomDays };
}

export function calibratePersonalThreshold(
  checkins: readonly SymptomCheckin[],
  signals: readonly IllnessSignal[],
  defaultThreshold: number,
) {
  const labels = new Map(checkins.map((item) => [item.dayId, item.status]));
  const samples = signals
    .filter((item): item is IllnessSignal & { score: number } => item.score != null && Number.isFinite(item.score) && labels.has(item.dayId))
    .map((item) => ({ dayId: item.dayId, score: item.score, symptomatic: labels.get(item.dayId) !== 'normal' }));
  const normalDays = samples.filter((item) => !item.symptomatic).length;
  const positiveDays = samples.filter((item) => item.symptomatic).sort((a, b) => a.dayId.localeCompare(b.dayId));
  let symptomEpisodes = 0;
  let previousOrdinal: number | null = null;
  for (const item of positiveDays) {
    const [year, month, day] = item.dayId.split('-').map(Number);
    const ordinal = Date.UTC(year, month - 1, day) / 86_400_000;
    if (previousOrdinal == null || ordinal - previousOrdinal > 3) symptomEpisodes++;
    previousOrdinal = ordinal;
  }
  if (symptomEpisodes < 3 || normalDays < 14) {
    return { status: 'calibrating' as const, threshold: defaultThreshold, symptomEpisodes, normalDays, matchedDays: samples.length };
  }

  const candidates = [...new Set([defaultThreshold, ...samples.map((item) => item.score)])].sort((a, b) => a - b);
  let threshold = defaultThreshold;
  let bestBalancedAccuracy = -1;
  for (const candidate of candidates) {
    let tp = 0, fn = 0, tn = 0, fp = 0;
    for (const item of samples) {
      const predicted = item.score >= candidate;
      if (item.symptomatic && predicted) tp++;
      else if (item.symptomatic) fn++;
      else if (predicted) fp++;
      else tn++;
    }
    const sensitivity = tp / (tp + fn);
    const specificity = tn / (tn + fp);
    const balancedAccuracy = (sensitivity + specificity) / 2;
    if (balancedAccuracy > bestBalancedAccuracy || (balancedAccuracy === bestBalancedAccuracy && candidate > threshold)) {
      bestBalancedAccuracy = balancedAccuracy;
      threshold = candidate;
    }
  }
  return { status: 'ready' as const, threshold, symptomEpisodes, normalDays, matchedDays: samples.length, trainingBalancedAccuracy: bestBalancedAccuracy };
}
