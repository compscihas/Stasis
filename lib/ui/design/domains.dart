// Domain accents — vivid neon hues per health domain, with darker equivalents
// in light mode so the same accents stay readable on pale gray surfaces.
//
// Use `DomainAccent.sleep` etc. wherever a card/visual belongs to a domain;
// keep `AppColors.accent` (brand cyan/teal) for brand moments. `heart` is a
// deliberate, contained exception: it keeps the ember coral as ITS domain
// identity (distinct from the app-wide brand accent, which moved off orange
// so genuinely low/urgent states stay legible) — every other domain below is
// a non-alert hue so nothing outside Heart/status colours reads as "urgent".

import 'package:flutter/widgets.dart';

import '../../theme/tokens.dart';

class DomainAccent {
  DomainAccent._();

  /// Heart / cardio — vivid pink.
  static Color get heart => AppColors.coral;

  /// Recovery / readiness — electric green.
  static Color get recovery => AppColors.good;

  /// Sleep — violet.
  static Color get sleep =>
      AppColors.isDark ? const Color(0xFFB56CFF) : const Color(0xFF7543C9);

  /// Strain / training load — electric amber.
  static Color get strain =>
      AppColors.isDark ? const Color(0xFFFFC857) : const Color(0xFF9A6400);

  /// Movement / steps — bright mint.
  static Color get steps =>
      AppColors.isDark ? const Color(0xFF36FFD1) : const Color(0xFF098C78);

  /// Energy / calories — a confident chartreuse-gold, deliberately NOT
  /// orange: calories is a routine daily-glance number, not an alert, and the
  /// old orange card sat in the same "something needs attention" family as
  /// the brand accent, the AI card and the strain domain all at once.
  static Color get calories =>
      AppColors.isDark ? const Color(0xFFD1FF4D) : const Color(0xFF728F12);

  /// Respiration / oxygen — bright sky blue.
  static Color get oxygen =>
      AppColors.isDark ? const Color(0xFF65B9FF) : const Color(0xFF2777C8);

  /// Stress / arousal — hot pink.
  static Color get stress =>
      AppColors.isDark ? const Color(0xFFFF77C6) : const Color(0xFFC03774);

  /// Menstrual cycle — magenta (distinct from stress and heart pink).
  static Color get cycle =>
      AppColors.isDark ? const Color(0xFFFA7BEF) : const Color(0xFFAE428E);

  /// Deeper plum companion for the cycle domain (ovulation/luteal marks).
  static Color get cyclePlum =>
      AppColors.isDark ? const Color(0xFFCF91FF) : const Color(0xFF7543C9);

  /// Sleep-stage palette (Awake / REM / Light / Deep) — one source for every
  /// hypnogram + stage bar.
  static Color get stageAwake => AppColors.warn;
  static Color get stageRem => sleep;
  static Color get stageLight =>
      AppColors.isDark ? const Color(0xFFFFAA66) : kLightStageColor;
  static Color get stageDeep =>
      AppColors.isDark ? const Color(0xFF9D65FF) : const Color(0xFF6843C0);
}
