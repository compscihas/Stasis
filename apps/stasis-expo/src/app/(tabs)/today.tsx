import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FeelingChoices } from '@/components/feeling-choices';
import { Screen } from '@/components/screen';
import { MetricCard, MetricRow, PreviewBadge, ReadinessRing, ScreenTitle, SectionTitle, TactilePressable, Tile } from '@/components/ui';
import { currentHeartRate, heartRate24Hour, hrvTrend, previewSnapshot, previewStepsTrend, previewStressTrend } from '@/data/preview-data';
import { localDayId, type SymptomCheckin } from '@/data/symptom-model';
import { getSymptomCheckin } from '@/data/symptom-repository';
import { colors, radius, spacing } from '@/design/tokens';

export default function TodayScreen() {
  const snapshot = previewSnapshot;
  const [checkin, setCheckin] = useState<SymptomCheckin | null>(null);
  const [loadError, setLoadError] = useState(false);
  const dayId = localDayId();
  useFocusEffect(useCallback(() => {
    let active = true;
    getSymptomCheckin(dayId).then((value) => {
      if (active) { setCheckin(value); setLoadError(false); }
    }).catch(() => { if (active) setLoadError(true); });
    return () => { active = false; };
  }, [dayId]));

  return (
    <Screen>
      <ScreenTitle action={<PreviewBadge />}>Today</ScreenTitle>
      <View style={styles.readiness}>
        <ReadinessRing compact value={snapshot.readiness} />
        <View style={styles.copy}><Text style={styles.readinessTitle}>Readiness</Text><Text style={styles.muted}>Steady today</Text></View>
      </View>

      <Tile style={styles.checkin}>
        <View style={styles.row}>
          <Ionicons color={colors.blue} name="shield-checkmark-outline" size={23} />
          <Text style={styles.checkinTitle}>Illness Watch</Text>
          <TactilePressable accessibilityLabel="Review illness check-in" onPress={() => router.push('/illness')} style={styles.review}><Ionicons color={colors.textMuted} name="ellipsis-horizontal" size={21} /></TactilePressable>
        </View>
        <Text style={styles.question}>How are you feeling?</Text>
        <FeelingChoices value={checkin?.status ?? null} onChange={(status) => router.push({ pathname: '/illness', params: { feeling: status } })} />
        <View style={styles.checkinFooter}>
          <Text style={styles.meta}>{loadError ? 'Check-in unavailable. Tap to retry.' : checkin ? 'Checked in today' : 'Not checked in today'}</Text>
          <Text style={styles.meta}>Wearable analysis not yet enabled</Text>
        </View>
      </Tile>

      <View>
        <SectionTitle action={<Text style={styles.meta}>Preview trends</Text>}>Today's vitals</SectionTitle>
        <MetricRow accent={colors.coral} icon="heart" label="Current heart rate" value={String(currentHeartRate ?? '\u2014')} unit="bpm" trend={{ values: heartRate24Hour, period: 'last 24 hours' }} />
        <MetricRow accent={colors.cyan} icon="pulse" label="HRV" value={String(snapshot.hrv ?? '\u2014')} unit="ms" trend={{ values: hrvTrend, period: 'last 7 days' }} />
        <MetricRow accent={colors.mint} icon="footsteps" label="Steps" value={snapshot.steps?.toLocaleString() ?? '\u2014'} trend={{ values: previewStepsTrend, period: 'last 7 days', kind: 'bars' }} />
        <MetricRow accent={colors.amber} icon="flash-outline" label="Stress" value={String(snapshot.stress ?? '\u2014')} unit="/100" trend={{ values: previewStressTrend, period: 'today' }} />
      </View>

      <View style={styles.summary}>
        <SectionTitle>Sleep & strain</SectionTitle>
        <View style={styles.row}>
          <MetricCard accent={colors.purple} icon="moon" label="Sleep" value={snapshot.sleepMinutes == null ? '\u2014' : `${Math.floor(snapshot.sleepMinutes / 60)}h ${snapshot.sleepMinutes % 60}m`} />
          <MetricCard accent={colors.coral} icon="fitness" label="Strain" value={String(snapshot.strain ?? '\u2014')} />
        </View>
      </View>

      <TactilePressable onPress={() => router.push('/coach')} style={styles.coach}>
        <Ionicons color={colors.blue} name="chatbubble-outline" size={25} />
        <View style={styles.copy}><Text style={styles.coachTitle}>Stasis Coach</Text><Text style={styles.muted}>A quiet day fits your current recovery.</Text></View>
        <Ionicons color={colors.textMuted} name="chevron-forward" size={18} />
      </TactilePressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  readiness: { alignItems: 'center', backgroundColor: colors.mintFill, borderRadius: radius.md, flexDirection: 'row', gap: spacing.md, padding: spacing.md },
  copy: { flex: 1, minWidth: 0 },
  readinessTitle: { color: colors.text, fontSize: 19, fontWeight: '600', marginBottom: 4 },
  muted: { color: colors.textMuted, fontSize: 13, lineHeight: 19 },
  row: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  checkin: { gap: spacing.md },
  checkinTitle: { color: colors.text, flex: 1, fontSize: 16, fontWeight: '600' },
  review: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44, marginVertical: -10 },
  question: { color: colors.textMuted, fontSize: 14 },
  checkinFooter: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },
  meta: { color: colors.textMuted, fontSize: 11, lineHeight: 16 },
  summary: { gap: spacing.sm },
  coach: { alignItems: 'center', borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, flexDirection: 'row', gap: spacing.md, padding: spacing.md },
  coachTitle: { color: colors.text, fontSize: 15, fontWeight: '600', marginBottom: 4 },
});
