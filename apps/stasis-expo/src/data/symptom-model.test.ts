import { calibratePersonalThreshold, evaluateSignalFeedback, localDayId, normalizeTemperature, onsetAtForChoice, summarizeCheckins, type IllnessSignal, type SymptomCheckin } from './symptom-model';

function checkin(dayId: string, status: SymptomCheckin['status']): SymptomCheckin {
  return { dayId, status, symptoms: [], severity: null, onsetAt: null, temperatureC: null, testStatus: null, confounders: [], note: '', createdAt: 1, updatedAt: 1 };
}

function signal(dayId: string, state: IllnessSignal['state']): IllnessSignal {
  return { dayId, state, detectorVersion: 1, score: null, drivers: [], userLabel: null, computedAt: 1 };
}

describe('symptom model', () => {
  it('uses local calendar fields for day labels', () => {
    expect(localDayId(new Date(2026, 7, 20, 23, 55))).toBe('2026-08-20');
  });

  it('validates optional measured temperature without inventing one', () => {
    expect(normalizeTemperature('')).toBeNull();
    expect(normalizeTemperature('38.26')).toBe(38.3);
    expect(() => normalizeTemperature('50')).toThrow(/30 and 45/);
  });

  it('uses calendar subtraction for approximate onset', () => {
    const now = new Date(2026, 2, 9, 8, 30);
    expect(localDayId(new Date(onsetAtForChoice('yesterday', now)!))).toBe('2026-03-08');
    expect(onsetAtForChoice('unsure', now)).toBeNull();
  });

  it('requires both normal and symptomatic labels for useful calibration coverage', () => {
    expect(summarizeCheckins([checkin('2026-08-19', 'normal')]).hasBothLabels).toBe(false);
    expect(summarizeCheckins([checkin('2026-08-19', 'normal'), checkin('2026-08-20', 'off')]).hasBothLabels).toBe(true);
  });

  it('scores only days with both a signal and an explicit user label', () => {
    const result = evaluateSignalFeedback(
      [checkin('2026-08-18', 'normal'), checkin('2026-08-19', 'sick'), checkin('2026-08-20', 'off')],
      [signal('2026-08-18', 'elevated'), signal('2026-08-19', 'elevated'), signal('2026-08-20', 'normal'), signal('2026-08-21', 'elevated')],
    );
    expect(result).toEqual({ matched: 3, usefulAlerts: 1, falseAlerts: 1, missedSymptomDays: 1 });
  });

  it('abstains from personal threshold training with sparse labels', () => {
    const calibration = calibratePersonalThreshold(
      [checkin('2026-08-19', 'normal'), checkin('2026-08-20', 'sick')],
      [signal('2026-08-19', 'normal'), { ...signal('2026-08-20', 'elevated'), score: 4 }],
      5,
    );
    expect(calibration.status).toBe('calibrating');
    expect(calibration.threshold).toBe(5);
  });

  it('calibrates only after enough separate episodes and normal matched days', () => {
    const normals = Array.from({ length: 14 }, (_, index) => checkin(`2026-07-${String(index + 1).padStart(2, '0')}`, 'normal'));
    const sick = [checkin('2026-07-16', 'sick'), checkin('2026-07-21', 'sick'), checkin('2026-07-26', 'sick')];
    const reports = [...normals, ...sick];
    const signals = reports.map((item) => ({ ...signal(item.dayId, item.status === 'normal' ? 'normal' : 'elevated'), score: item.status === 'normal' ? 1 : 8 }));
    const calibration = calibratePersonalThreshold(reports, signals, 6);
    expect(calibration.status).toBe('ready');
    expect(calibration.threshold).toBeGreaterThan(1);
  });
});
