import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { Card, GlassButton, GlassSurface, MetricCard, PreviewBadge, ReadinessRing, ScreenTitle, SectionTitle, TactilePressable } from '@/components/ui';
import { currentHeartRate, previewSnapshot } from '@/data/preview-data';
import { localDayId, type SymptomCheckin } from '@/data/symptom-model';
import { getSymptomCheckin } from '@/data/symptom-repository';
import { colors, radius, spacing, typography } from '@/design/tokens';

function formatSleep(minutes: number | null) {
  if (minutes == null) return '—';
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

function formatInteger(value: number | null) {
  if (value == null) return '—';
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function TodayScreen() {
  const snapshot = previewSnapshot;
  const [checkin, setCheckin] = useState<SymptomCheckin | null>(null);
  useFocusEffect(useCallback(() => {
    getSymptomCheckin(localDayId()).then(setCheckin).catch((error: unknown) => console.warn('[today-checkin] load failed', error));
  }, []));

  const feeling = checkin?.status === 'normal'
    ? 'Feeling normal today'
    : checkin?.status === 'off'
      ? 'You reported feeling off'
      : checkin?.status === 'sick'
        ? 'You reported feeling sick'
        : 'How are you feeling?';
  return (
    <Screen>
      <ScreenTitle action={<PreviewBadge />}>Today</ScreenTitle>

      <Card style={styles.hero}>
        <ReadinessRing value={snapshot.readiness} />
        <Text style={styles.heroHeadline}>Your body looks steady.</Text>
        <Text style={styles.heroBody}>Keep the day controlled and leave room for recovery tonight.</Text>
        <View style={styles.heroPills}>
          <GlassSurface clear style={styles.heroPill}>
            <Ionicons color={colors.purple} name="moon" size={15} />
            <Text style={styles.heroPillText}>{formatSleep(snapshot.sleepMinutes)} sleep</Text>
          </GlassSurface>
          <GlassSurface clear style={styles.heroPill}>
            <Ionicons color={colors.coral} name="pulse" size={15} />
            <Text style={styles.heroPillText}>{snapshot.strain ?? '—'} strain</Text>
          </GlassSurface>
        </View>
      </Card>

      <SectionTitle>Vitals</SectionTitle>
      <View style={styles.metricRow}>
        <MetricCard icon="pulse-outline" label="HRV" value={`${snapshot.hrv ?? '—'}`} unit="ms" accent={colors.mint} />
        <MetricCard icon="heart-outline" label="Current HR" value={`${currentHeartRate ?? '—'}`} unit="bpm" accent={colors.coral} />
      </View>
      <View style={styles.metricRow}>
        <MetricCard icon="footsteps-outline" label="Steps" value={formatInteger(snapshot.steps)} accent={colors.cyan} />
        <MetricCard icon="flash-outline" label="Stress" value={`${snapshot.stress ?? '—'}`} unit="/100" accent={colors.amber} />
      </View>

      <SectionTitle>Insights</SectionTitle>
      <Card style={styles.insightCard}>
        <View style={styles.insightTop}>
          <GlassSurface clear style={styles.insightIcon}>
            <Ionicons color={colors.cyan} name="sparkles" size={20} />
          </GlassSurface>
          <View style={styles.insightCopy}>
            <Text style={styles.insightKicker}>Stasis Coach</Text>
            <Text style={styles.insightTitle}>A quiet day fits your current recovery.</Text>
          </View>
        </View>
        <GlassButton icon="arrow-forward" onPress={() => router.push('/coach')}>Ask Coach</GlassButton>
      </Card>

      <TactilePressable onPress={() => router.push('/illness')}>
        <Card style={styles.illnessCard}>
          <View style={styles.illnessIcon}>
            <Ionicons color={checkin?.status === 'normal' ? colors.mint : colors.amber} name="medical-outline" size={21} />
          </View>
          <View style={styles.insightCopy}>
            <Text style={styles.illnessKicker}>Illness Watch</Text>
            <Text style={styles.illnessTitle}>{feeling}</Text>
            <Text style={styles.illnessMeta}>{checkin ? 'Tap to review today’s check-in' : 'A quick check-in improves personalization'}</Text>
          </View>
          <Ionicons color={colors.textFaint} name="chevron-forward" size={18} />
        </Card>
      </TactilePressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', overflow: 'hidden', paddingBottom: spacing.lg, paddingTop: spacing.lg },
  heroHeadline: { color: colors.text, ...typography.title2, marginTop: spacing.lg, textAlign: 'center' },
  heroBody: { color: colors.textMuted, ...typography.body, marginTop: spacing.xs, maxWidth: 300, textAlign: 'center' },
  heroPills: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  heroPill: { alignItems: 'center', borderCurve: 'continuous', borderRadius: radius.pill, flexDirection: 'row', gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: 9 },
  heroPillText: { color: colors.text, fontSize: 12, fontWeight: '600' },
  metricRow: { flexDirection: 'row', gap: spacing.sm },
  insightCard: { gap: spacing.md },
  insightTop: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  insightIcon: { alignItems: 'center', borderCurve: 'continuous', borderRadius: radius.md, height: 46, justifyContent: 'center', width: 46 },
  insightCopy: { flex: 1 },
  insightKicker: { color: colors.cyan, fontSize: 12, fontWeight: '600' },
  insightTitle: { color: colors.text, fontSize: 17, fontWeight: '600', lineHeight: 23, marginTop: 3 },
  illnessCard: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  illnessIcon: { alignItems: 'center', backgroundColor: colors.surfaceRaised, borderRadius: radius.md, height: 46, justifyContent: 'center', width: 46 },
  illnessKicker: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  illnessTitle: { color: colors.text, fontSize: 16, fontWeight: '600', marginTop: 2 },
  illnessMeta: { color: colors.textMuted, fontSize: 11, marginTop: 3 },
});
