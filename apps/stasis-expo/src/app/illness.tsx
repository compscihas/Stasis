import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '@/components/screen';
import { Card, Eyebrow, GlassButton, IconButton, TactilePressable } from '@/components/ui';
import { confounderOptions, localDayId, normalizeTemperature, onsetAtForChoice, summarizeCheckins, symptomOptions, type ConfounderId, type FeelingStatus, type IllnessSignal, type OnsetChoice, type SymptomCheckin, type SymptomId, type TestStatus } from '@/data/symptom-model';
import { getSymptomCheckin, recentIllnessSignals, recentSymptomCheckins, saveSymptomCheckin } from '@/data/symptom-repository';
import { colors, radius, spacing } from '@/design/tokens';

const symptomLabels: Record<SymptomId, string> = {
  sore_throat: 'Sore throat',
  congestion: 'Congestion',
  cough: 'Cough',
  headache: 'Headache',
  fever_chills: 'Fever / chills',
  fatigue: 'Fatigue',
  body_aches: 'Body aches',
  stomach: 'Stomach',
};

const confounderLabels: Record<ConfounderId, string> = {
  hard_training: 'Hard training',
  alcohol: 'Alcohol',
  travel: 'Travel',
  poor_sleep: 'Poor sleep',
  medication: 'Medication',
  high_stress: 'High stress',
};

const statusLabels: Record<FeelingStatus, string> = {
  normal: 'Feeling normal',
  off: 'Something feels off',
  sick: 'I feel sick',
};

export default function IllnessScreen() {
  const dayId = localDayId();
  const [status, setStatus] = useState<FeelingStatus | null>(null);
  const [symptoms, setSymptoms] = useState<SymptomId[]>([]);
  const [severity, setSeverity] = useState<1 | 2 | 3 | null>(null);
  const [onsetChoice, setOnsetChoice] = useState<OnsetChoice>('today');
  const [temperature, setTemperature] = useState('');
  const [testStatus, setTestStatus] = useState<TestStatus | null>(null);
  const [confounders, setConfounders] = useState<ConfounderId[]>([]);
  const [note, setNote] = useState('');
  const [history, setHistory] = useState<SymptomCheckin[]>([]);
  const [signals, setSignals] = useState<IllnessSignal[]>([]);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    Promise.all([getSymptomCheckin(dayId), recentSymptomCheckins(30), recentIllnessSignals(30)])
      .then(([today, recent, signals]) => {
        setHistory(recent);
        setSignals(signals);
        if (!today) return;
        setStatus(today.status);
        setSymptoms(today.symptoms);
        setSeverity(today.severity);
        setOnsetChoice(today.onsetAt == null ? 'unsure' : localDayId(new Date(today.onsetAt)) === dayId ? 'today' : 'yesterday');
        setTemperature(today.temperatureC == null ? '' : String(today.temperatureC));
        setTestStatus(today.testStatus);
        setConfounders(today.confounders);
        setNote(today.note);
      })
      .catch((error: unknown) => console.warn('[symptom-checkin] load failed', error));
  }, [dayId]);

  useFocusEffect(load);

  function toggle<T>(value: T, values: T[], setValues: (next: T[]) => void) {
    setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  }

  async function save() {
    if (!status) {
      Alert.alert('Choose how you feel', 'Select normal, something feels off, or sick.');
      return;
    }
    if (status !== 'normal' && severity == null) {
      Alert.alert('Add severity', 'Choose mild, moderate, or severe.');
      return;
    }
    setSaving(true);
    try {
      await saveSymptomCheckin({
        dayId,
        status,
        symptoms,
        severity,
        onsetAt: onsetAtForChoice(onsetChoice),
        temperatureC: normalizeTemperature(temperature),
        testStatus,
        confounders,
        note,
      });
      await load();
      Alert.alert('Check-in saved', 'Stored locally on this device.');
    } catch (error) {
      Alert.alert('Could not save', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setSaving(false);
    }
  }

  const summary = summarizeCheckins(history);
  return (
    <Screen keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <IconButton accessibilityLabel="Close illness watch" icon="close" onPress={() => router.back()} />
        <View style={styles.title}>
          <Text style={styles.kicker}>PERSONAL BASELINE</Text>
          <Text style={styles.heading}>Illness Watch</Text>
        </View>
      </View>

      <Card>
        <Eyebrow>TODAY · {dayId}</Eyebrow>
        <Text style={styles.question}>How are you feeling?</Text>
        <View style={styles.statusStack}>
          {(['normal', 'off', 'sick'] as const).map((value) => (
            <Choice key={value} active={status === value} label={statusLabels[value]} onPress={() => setStatus(value)} />
          ))}
        </View>
      </Card>

      {status && status !== 'normal' ? (
        <>
          <Card>
            <Eyebrow>SYMPTOMS · SELECT ANY</Eyebrow>
            <View style={styles.chips}>
              {symptomOptions.map((value) => (
                <Chip key={value} active={symptoms.includes(value)} label={symptomLabels[value]} onPress={() => toggle(value, symptoms, setSymptoms)} />
              ))}
            </View>
            <Text style={styles.fieldLabel}>Severity</Text>
            <View style={styles.segmentRow}>
              {([1, 2, 3] as const).map((value) => (
                <Chip key={value} active={severity === value} label={['Mild', 'Moderate', 'Severe'][value - 1]} onPress={() => setSeverity(value)} />
              ))}
            </View>
            <Text style={styles.fieldLabel}>When did this start?</Text>
            <View style={styles.chips}>
              {(['today', 'yesterday', 'unsure'] as const).map((value) => (
                <Chip key={value} active={onsetChoice === value} label={{ today: 'Today', yesterday: 'Yesterday', unsure: 'Not sure' }[value]} onPress={() => setOnsetChoice(value)} />
              ))}
            </View>
            <Text style={styles.fieldLabel}>Measured temperature (optional, °C)</Text>
            <TextInput keyboardType="decimal-pad" onChangeText={setTemperature} placeholder="e.g. 37.8" placeholderTextColor={colors.textMuted} style={styles.input} value={temperature} />
            <Text style={styles.fieldLabel}>Test result (optional)</Text>
            <View style={styles.chips}>
              {(['not_tested', 'negative', 'positive'] as const).map((value) => (
                <Chip key={value} active={testStatus === value} label={{ not_tested: 'Not tested', negative: 'Negative', positive: 'Positive' }[value]} onPress={() => setTestStatus(value)} />
              ))}
            </View>
          </Card>
        </>
      ) : null}

      {status ? (
        <Card>
          <Eyebrow>POSSIBLE CONFOUNDERS · OPTIONAL</Eyebrow>
          <Text style={styles.helper}>These help distinguish illness from other causes of physiological change.</Text>
          <View style={styles.chips}>
            {confounderOptions.map((value) => (
              <Chip key={value} active={confounders.includes(value)} label={confounderLabels[value]} onPress={() => toggle(value, confounders, setConfounders)} />
            ))}
          </View>
          <Text style={styles.fieldLabel}>Note (optional)</Text>
          <TextInput multiline maxLength={500} onChangeText={setNote} placeholder="Anything else that may matter…" placeholderTextColor={colors.textMuted} style={[styles.input, styles.note]} value={note} />
        </Card>
      ) : null}

      <GlassButton disabled={saving || !status} icon="checkmark" onPress={save} primary>
        {saving ? 'Saving…' : history.some((item) => item.dayId === dayId) ? 'Update today’s check-in' : 'Save today’s check-in'}
      </GlassButton>

      <Card>
        <Eyebrow>PERSONALIZATION</Eyebrow>
        <Text style={styles.learningTitle}>{summary.total === 0 ? 'Waiting for your first check-in' : `${summary.total} check-in${summary.total === 1 ? '' : 's'} recorded`}</Text>
        <Text style={styles.helper}>{summary.normalDays} normal · {summary.symptomaticDays} symptomatic</Text>
        <Text style={styles.disclosure}>
          {signals.length === 0
            ? 'Wearable anomaly input is not enabled in the Expo migration yet. Your reports are stored locally and will become detector feedback after the validated analytics port.'
            : `${signals.length} wearable signal${signals.length === 1 ? '' : 's'} available for local feedback matching. Conservative threshold training requires 3 separate symptom episodes and 14 explicitly normal matched days.`}
        </Text>
      </Card>

      {history.length ? (
        <Card>
          <Eyebrow>RECENT CHECK-INS</Eyebrow>
          {history.slice(0, 7).map((item) => (
            <View key={item.dayId} style={styles.historyRow}>
              <View style={[styles.dot, { backgroundColor: item.status === 'normal' ? colors.mint : item.status === 'off' ? colors.amber : colors.coral }]} />
              <View style={styles.historyCopy}>
                <Text style={styles.historyTitle}>{statusLabels[item.status]}</Text>
                <Text style={styles.historyDetail}>{item.dayId}{item.symptoms.length ? ` · ${item.symptoms.map((value) => symptomLabels[value]).join(', ')}` : ''}</Text>
              </View>
            </View>
          ))}
        </Card>
      ) : null}

      <Text style={styles.safety}>This feature identifies changes from your usual pattern; it does not diagnose illness. Seek medical help for severe or concerning symptoms.</Text>
    </Screen>
  );
}

function Choice({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <TactilePressable onPress={onPress} style={[styles.choice, active && styles.choiceActive]}>
      <Ionicons color={active ? colors.cyan : colors.textMuted} name={active ? 'radio-button-on' : 'radio-button-off'} size={20} />
      <Text style={[styles.choiceText, active && styles.choiceTextActive]}>{label}</Text>
    </TactilePressable>
  );
}

function Chip({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return <TactilePressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}><Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text></TactilePressable>;
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  title: { flex: 1 },
  kicker: { color: colors.cyan, fontSize: 10, fontWeight: '800', letterSpacing: 1.1 },
  heading: { color: colors.text, fontSize: 28, fontWeight: '800', letterSpacing: -0.7, marginTop: 2 },
  question: { color: colors.text, fontSize: 20, fontWeight: '800', marginTop: spacing.sm },
  statusStack: { gap: spacing.sm, marginTop: spacing.md },
  choice: { alignItems: 'center', backgroundColor: colors.surfaceRaised, borderColor: colors.border, borderRadius: radius.sm, borderWidth: 1, flexDirection: 'row', gap: spacing.sm, padding: spacing.md },
  choiceActive: { backgroundColor: colors.blueFill, borderColor: colors.blue },
  choiceText: { color: colors.textMuted, fontSize: 15, fontWeight: '700' },
  choiceTextActive: { color: colors.text },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  segmentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  chip: { borderColor: colors.border, borderRadius: radius.pill, borderWidth: 1, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  chipActive: { backgroundColor: colors.blueFill, borderColor: colors.blue },
  chipText: { color: colors.textMuted, fontSize: 13, fontWeight: '700' },
  chipTextActive: { color: colors.cyan },
  fieldLabel: { color: colors.text, fontSize: 13, fontWeight: '700', marginTop: spacing.lg },
  input: { backgroundColor: colors.controlFill, borderColor: colors.border, borderCurve: 'continuous', borderRadius: radius.sm, borderWidth: 1, color: colors.text, fontSize: 15, marginTop: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: 13 },
  note: { minHeight: 90, textAlignVertical: 'top' },
  helper: { color: colors.textMuted, fontSize: 12, lineHeight: 18, marginTop: spacing.sm },
  learningTitle: { color: colors.text, fontSize: 17, fontWeight: '800', marginTop: spacing.sm },
  disclosure: { color: colors.amber, fontSize: 12, lineHeight: 18, marginTop: spacing.md },
  historyRow: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', gap: spacing.sm, paddingVertical: spacing.sm },
  dot: { borderRadius: radius.pill, height: 10, width: 10 },
  historyCopy: { flex: 1 },
  historyTitle: { color: colors.text, fontSize: 14, fontWeight: '700' },
  historyDetail: { color: colors.textMuted, fontSize: 11, lineHeight: 16, marginTop: 2 },
  safety: { color: colors.textMuted, fontSize: 11, lineHeight: 17, paddingHorizontal: spacing.sm, textAlign: 'center' },
});
