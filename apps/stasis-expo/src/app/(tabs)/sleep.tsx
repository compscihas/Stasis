import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View, type ColorValue } from 'react-native';

import { Screen } from '@/components/screen';
import { Card, Eyebrow, GlassSurface, PreviewBadge, ScreenTitle, SectionTitle } from '@/components/ui';
import { previewSleep, previewSnapshot } from '@/data/preview-data';
import { colors, radius, spacing, typography } from '@/design/tokens';
import type { SleepStage } from '@/domain/models';

const stageColor: Record<SleepStage, ColorValue> = {
  awake: colors.amber,
  rem: colors.purple,
  light: colors.blue,
  deep: '#5E5CE6',
};

export default function SleepScreen() {
  const total = previewSleep.reduce((sum, segment) => sum + segment.minutes, 0);
  return (
    <Screen>
      <ScreenTitle action={<PreviewBadge />}>Sleep</ScreenTitle>
      <Card style={styles.hero}>
        <View style={styles.heroHeader}>
          <View>
            <Text style={styles.heroLabel}>Time asleep</Text>
            <Text style={styles.heroValue}>{Math.floor(total / 60)}<Text style={styles.heroUnit}> hr </Text>{total % 60}<Text style={styles.heroUnit}> min</Text></Text>
          </View>
          <View style={styles.efficiency}>
            <Ionicons color={colors.mint} name="checkmark-circle" size={17} />
            <Text style={styles.efficiencyValue}>{previewSnapshot.sleepEfficiency}%</Text>
            <Text style={styles.muted}>efficiency</Text>
          </View>
        </View>
        <View style={styles.timeline}>
          {previewSleep.map((segment, index) => (
            <View key={`${segment.stage}-${index}`} style={{ backgroundColor: stageColor[segment.stage], flex: segment.minutes, minWidth: 5 }} />
          ))}
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.muted}>11:17 PM</Text>
          <Text style={styles.muted}>6:29 AM</Text>
        </View>
      </Card>

      <SectionTitle>Sleep stages</SectionTitle>
      <Card style={styles.stages}>
        {previewSleep.map((segment) => (
          <View key={segment.stage} style={styles.stageRow}>
            <View style={[styles.stageDot, { backgroundColor: stageColor[segment.stage] }]} />
            <Text style={styles.stageName}>{segment.stage}</Text>
            <View style={styles.stageTrack}>
              <View style={[styles.stageFill, { backgroundColor: stageColor[segment.stage], width: `${(segment.minutes / total) * 100}%` }]} />
            </View>
            <Text style={styles.stageMinutes}>{segment.minutes}m</Text>
          </View>
        ))}
      </Card>

      <Card style={styles.guidance}>
        <GlassSurface clear style={styles.guidanceIcon}><Ionicons color={colors.cyan} name="moon-outline" size={20} /></GlassSurface>
        <View style={styles.guidanceCopy}>
          <Eyebrow>Sleep consistency</Eyebrow>
          <Text style={styles.guidanceTitle}>Your sleep window was close to schedule.</Text>
          <Text style={styles.guidanceBody}>Real trends remain unavailable until wearable derivation is ported.</Text>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { borderBottomColor: colors.border, borderBottomWidth: 1, paddingBottom: spacing.lg },
  stages: { gap: 0 },
  heroHeader: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  heroLabel: { color: colors.textMuted, fontSize: 13, fontWeight: '500' },
  heroValue: { color: colors.text, fontSize: 42, fontWeight: '700', letterSpacing: 0, marginTop: 2 },
  heroUnit: { color: colors.textMuted, fontSize: 16, fontWeight: '500', letterSpacing: 0 },
  efficiency: { alignItems: 'flex-end' },
  efficiencyValue: { color: colors.mint, fontSize: 23, fontWeight: '700', marginTop: 3 },
  muted: { color: colors.textMuted, ...typography.caption },
  timeline: { borderCurve: 'continuous', borderRadius: radius.sm, flexDirection: 'row', height: 58, marginTop: spacing.xl, overflow: 'hidden' },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  stageRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, paddingVertical: 11 },
  stageDot: { borderRadius: radius.pill, height: 9, width: 9 },
  stageName: { color: colors.text, fontSize: 14, fontWeight: '600', textTransform: 'capitalize', width: 46 },
  stageTrack: { backgroundColor: colors.surfaceRaised, borderRadius: radius.pill, flex: 1, height: 7, overflow: 'hidden' },
  stageFill: { borderRadius: radius.pill, height: '100%' },
  stageMinutes: { color: colors.textMuted, fontSize: 12, textAlign: 'right', width: 38 },
  guidance: { alignItems: 'center', borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', gap: spacing.md, paddingTop: spacing.md },
  guidanceIcon: { alignItems: 'center', borderCurve: 'continuous', borderRadius: radius.md, height: 48, justifyContent: 'center', width: 48 },
  guidanceCopy: { flex: 1 },
  guidanceTitle: { color: colors.text, fontSize: 15, fontWeight: '600', lineHeight: 21, marginTop: 4 },
  guidanceBody: { color: colors.textMuted, fontSize: 11, lineHeight: 16, marginTop: 3 },
});
