// Profile — the on-device personal profile fed to the DerivationEngine.
//
// Sourced from AppState's local profile map (shared_preferences). Algorithms
// that NEED a field (HRmax via Tanaka, Keytel calories, TRIMP sex constant,
// fitness-age) read it from here; algorithms that don't simply ignore it.
//
// HONESTY: a missing field => the DEPENDENT metric must return null+confidence 0
// (never a fabricated default). The engine therefore passes nullable getters and
// only computes profile-gated metrics when the input is present.

class Profile {
  final int? ageYears;
  final double? weightKg;
  final double? heightCm;
  final String? sex; // 'm' | 'f' (lowercase; matches the AppState profile map)
  final int? restingHrManual; // optional user-supplied RHR

  const Profile({
    this.ageYears,
    this.weightKg,
    this.heightCm,
    this.sex,
    this.restingHrManual,
  });

  static Profile fromMap(Map<String, dynamic>? m) {
    if (m == null) return const Profile();
    return Profile(
      ageYears: (m['age'] as num?)?.round(),
      weightKg: (m['weight_kg'] as num?)?.toDouble(),
      heightCm: (m['height_cm'] as num?)?.toDouble(),
      sex: (m['sex'] as String?)?.toLowerCase(),
      restingHrManual: (m['resting_hr'] as num?)?.round(),
    );
  }

  Map<String, dynamic> toMap() => {
        if (ageYears != null) 'age': ageYears,
        if (weightKg != null) 'weight_kg': weightKg,
        if (heightCm != null) 'height_cm': heightCm,
        if (sex != null) 'sex': sex,
        if (restingHrManual != null) 'resting_hr': restingHrManual,
      };

  /// Tanaka (2001): HRmax = 208 − 0.7·age. Null when age is unknown — the caller
  /// must NOT substitute 220−age or any default (that would fabricate a ceiling).
  double? get hrMaxTanaka =>
      ageYears == null ? null : 208 - 0.7 * (ageYears!.toDouble());

  bool get isComplete =>
      ageYears != null && weightKg != null && heightCm != null && sex != null;
}
