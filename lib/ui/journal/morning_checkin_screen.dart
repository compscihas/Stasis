import 'package:flutter/material.dart';

import '../design/design.dart';

/// A short, session-only wellbeing check-in opened from the morning reminder.
/// Answers are discarded when the screen closes and are never persisted.
class MorningCheckinScreen extends StatefulWidget {
  final String? initialMood;

  const MorningCheckinScreen({super.key, this.initialMood});

  @override
  State<MorningCheckinScreen> createState() => _MorningCheckinScreenState();
}

class _MoodChoice {
  final String id;
  final String face;
  final String label;
  const _MoodChoice(this.id, this.face, this.label);
}

class _FeelingChoice {
  final String id;
  final String label;
  const _FeelingChoice(this.id, this.label);
}

class _MorningCheckinScreenState extends State<MorningCheckinScreen> {
  static const _moods = [
    _MoodChoice('good', '😊', 'Good'),
    _MoodChoice('okay', '😐', 'Okay'),
    _MoodChoice('low', '☹️', 'Not great'),
  ];

  static const _feelings = [
    _FeelingChoice('tired', 'Tired'),
    _FeelingChoice('stressed', 'Stressed'),
    _FeelingChoice('sore', 'Sore'),
    _FeelingChoice('low_mood', 'Low mood'),
    _FeelingChoice('anxious', 'Anxious'),
    _FeelingChoice('unwell', 'Unwell'),
    _FeelingChoice('low_energy', 'Low energy'),
    _FeelingChoice('other', 'Something else'),
  ];

  static const _symptomsByFeeling = <String, List<String>>{
    'tired': ['Headache', 'Dizziness', 'Brain fog'],
    'stressed': ['Headache', 'Muscle tension', 'Stomach discomfort'],
    'sore': ['Muscle soreness', 'Joint pain', 'Cramps'],
    'low_mood': ['Low energy', 'Sleep changes', 'Appetite changes'],
    'anxious': ['Muscle tension', 'Stomach discomfort', 'Headache'],
    'unwell': [
      'Fever',
      'Cough',
      'Sore throat',
      'Nausea',
      'Headache',
      'Body aches',
    ],
    'low_energy': ['Dizziness', 'Weakness', 'Brain fog'],
    'other': ['Headache', 'Muscle soreness', 'Stomach discomfort'],
  };

  String? _mood;
  final Set<String> _feelingsSelected = {};
  final Set<String> _symptomsSelected = {};

  bool get _needsFollowup => _mood == 'okay' || _mood == 'low';

  @override
  void initState() {
    super.initState();
    _mood = widget.initialMood;
  }

  List<String> get _availableSymptoms {
    final result = <String>{};
    for (final feeling in _feelingsSelected) {
      result.addAll(_symptomsByFeeling[feeling] ?? const []);
    }
    return result.toList()..sort();
  }

  void _toggleFeeling(String id) {
    setState(() {
      if (!_feelingsSelected.add(id)) _feelingsSelected.remove(id);
      final available = _availableSymptoms.toSet();
      _symptomsSelected.removeWhere((symptom) => !available.contains(symptom));
    });
  }

  void _finishCheckin() {
    if (_mood == null || (_needsFollowup && _feelingsSelected.isEmpty)) {
      return;
    }
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Check-in complete. Your answers were not saved.'),
      ),
    );
    Navigator.of(context).maybePop();
  }

  @override
  Widget build(BuildContext context) {
    final symptoms = _availableSymptoms;
    final selectedMood = _moods.firstWhere(
      (mood) => mood.id == _mood,
      orElse: () => _moods.first,
    );
    final canSave =
        _mood != null && (!_needsFollowup || _feelingsSelected.isNotEmpty);
    return AppScaffold(
      title: 'Morning check-in',
      subtitle: 'A quick read on how you feel today',
      children: [
        if (widget.initialMood == null) ...[
          const SectionHeader('How are you feeling?'),
          SurfaceCard(
            child: Row(
              children: [
                for (final mood in _moods)
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      child: _MoodButton(
                        mood: mood,
                        selected: _mood == mood.id,
                        onTap: () => setState(() {
                          _mood = mood.id;
                          if (!_needsFollowup) {
                            _feelingsSelected.clear();
                            _symptomsSelected.clear();
                          }
                        }),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ] else ...[
          SectionHeader('You selected ${selectedMood.label}'),
          SurfaceCard(
            child: Text(
              '${selectedMood.face}  Mood selected from your notification',
              style: AppText.body,
            ),
          ),
        ],
        if (_needsFollowup) ...[
          const SizedBox(height: Sp.x5),
          const SectionHeader('What’s affecting you?'),
          SurfaceCard(
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: Sp.x2),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Choose any that fit.', style: AppText.captionMuted),
                  const SizedBox(height: Sp.x3),
                  Wrap(
                    spacing: Sp.x2,
                    runSpacing: Sp.x2,
                    children: [
                      for (final feeling in _feelings)
                        ToggleChip(
                          feeling.label,
                          selected: _feelingsSelected.contains(feeling.id),
                          onTap: () => _toggleFeeling(feeling.id),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          if (_feelingsSelected.isNotEmpty) ...[
            const SizedBox(height: Sp.x5),
            const SectionHeader('Any symptoms?'),
            SurfaceCard(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: Sp.x2),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'These options follow the feelings you selected. You can skip symptoms.',
                      style: AppText.captionMuted,
                    ),
                    const SizedBox(height: Sp.x3),
                    Wrap(
                      spacing: Sp.x2,
                      runSpacing: Sp.x2,
                      children: [
                        for (final symptom in symptoms)
                          ToggleChip(
                            symptom,
                            selected: _symptomsSelected.contains(symptom),
                            onTap: () => setState(() {
                              if (!_symptomsSelected.add(symptom)) {
                                _symptomsSelected.remove(symptom);
                              }
                            }),
                          ),
                        ToggleChip(
                          'No symptoms',
                          selected: _symptomsSelected.isEmpty,
                          onTap: () => setState(_symptomsSelected.clear),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ],
        const SizedBox(height: Sp.x5),
        SizedBox(
          width: double.infinity,
          child: FilledButton(
            onPressed: canSave ? _finishCheckin : null,
            child: const Text('Done'),
          ),
        ),
        const SizedBox(height: Sp.x2),
        Center(
          child: Text(
            'Your answers stay on this screen and are discarded when you leave.',
            style: AppText.captionMuted,
          ),
        ),
      ],
    );
  }
}

class _MoodButton extends StatelessWidget {
  final _MoodChoice mood;
  final bool selected;
  final VoidCallback onTap;

  const _MoodButton({
    required this.mood,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) => Semantics(
    button: true,
    selected: selected,
    label: mood.label,
    child: InkWell(
      borderRadius: BorderRadius.circular(R.card),
      onTap: onTap,
      child: AnimatedContainer(
        duration: Motion.fast,
        padding: const EdgeInsets.symmetric(vertical: Sp.x3),
        decoration: BoxDecoration(
          color: selected ? AppColors.accentSoft : Elevation.surfaceAt(1),
          borderRadius: BorderRadius.circular(R.card),
          border: Border.all(
            color: selected ? AppColors.accent : AppColors.divider,
            width: selected ? 1.5 : 1,
          ),
        ),
        child: Column(
          children: [
            Text(mood.face, style: const TextStyle(fontSize: 30)),
            const SizedBox(height: Sp.x1),
            Text(mood.label, style: AppText.label),
          ],
        ),
      ),
    ),
  );
}
