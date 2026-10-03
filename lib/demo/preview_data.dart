/// Clearly fictional values used only to make an empty, unpaired app useful
/// for a first-look preview. This map is never saved to the health database.
const Map<String, dynamic> previewTodayData = {
  'preview_data': true,
  'daily': {
    'readiness': {'value': 82, 'confidence': 0.92},
    'recovery': {'value': 78, 'confidence': 0.88},
    'strain': {'value': 12.4, 'confidence': 0.84},
    'resting_hr': {'value': 52, 'confidence': 0.96},
    'resting_hr_delta': {'value': -2, 'confidence': 0.9},
    'wear_min': {'value': 1380, 'confidence': 1.0},
    'calories': {'value': 640, 'confidence': 0.72, 'tier': 'estimate'},
    'steps': {'value': 8412, 'confidence': 0.9},
    'active_min': {'value': 54, 'confidence': 0.88},
    'vo2max': {'value': 48.2, 'confidence': 0.86},
    'fitness': {'value': 86, 'confidence': 0.82},
    'form': {'value': 1.1, 'confidence': 0.8},
  },
  'sleep': {
    'duration_min': {'value': 456, 'confidence': 0.95},
    'need_min': {'value': 480, 'confidence': 0.9},
    'efficiency': {'value': 0.91, 'confidence': 0.9},
  },
  'hrv': {'rmssd': 48, 'confidence': 0.92, 'baseline': 44},
  'stress': {'score': 34},
  'spo2': {'odi_per_hour': 1.2, 'confidence': 0.84},
  'step_goal': 10000,
};
