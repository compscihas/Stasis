import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { Card, Eyebrow, PreviewBadge, ScreenTitle, SectionTitle, Tile } from '@/components/ui';
import { previewWorkouts } from '@/data/preview-data';
import { colors, radius, spacing, typography } from '@/design/tokens';

export default function WorkoutsScreen() {
  return (
    <Screen>
      <ScreenTitle action={<PreviewBadge />}>Workouts</ScreenTitle>

      <Card style={styles.weekCard}>
        <View>
          <Text style={styles.weekLabel}>This week</Text>
          <Text style={styles.weekValue}>1<Text style={styles.weekUnit}> workout</Text></Text>
        </View>
        <View style={styles.weekStat}>
          <Text style={styles.weekStatValue}>42</Text>
          <Text style={styles.weekStatLabel}>minutes</Text>
        </View>
        <View style={styles.weekStat}>
          <Text style={styles.weekStatValue}>9.4</Text>
          <Text style={styles.weekStatLabel}>strain</Text>
        </View>
      </Card>

      <SectionTitle>Recent</SectionTitle>
      {previewWorkouts.map((workout) => (
        <Tile key={workout.id} style={styles.workoutCard}>
          <View style={styles.workoutHeader}>
            <View style={styles.workoutIcon}><Ionicons color={colors.cyan} name="walk" size={25} /></View>
            <View style={styles.workoutCopy}>
              <Text style={styles.workoutTitle}>{workout.type}</Text>
              <Text style={styles.workoutMeta}>Today at 7:32 AM</Text>
            </View>
          </View>
          <View style={styles.stats}>
            <Stat label="Strain" value={`${workout.strain ?? '—'}`} />
            <Stat label="Calories" value={`${workout.calories ?? '—'}`} />
            <Stat label="Duration" value={`${workout.durationMinutes}m`} />
          </View>
        </Tile>
      ))}
      <Card style={styles.notice}>
        <View style={styles.noticeIcon}><Ionicons color={colors.amber} name="construct-outline" size={20} /></View>
        <View style={styles.noticeCopy}>
          <Text style={styles.noticeTitle}>Workout recording unavailable</Text>
          <Text style={styles.noticeText}>Live workout recording is not enabled yet.</Text>
        </View>
      </Card>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <View style={styles.statBlock}><Eyebrow>{label}</Eyebrow><Text style={styles.stat}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  weekCard: { alignItems: 'flex-end', borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between', paddingBottom: spacing.lg },
  weekLabel: { color: colors.textMuted, fontSize: 13, fontWeight: '500' },
  weekValue: { color: colors.text, fontSize: 38, fontWeight: '700', letterSpacing: 0, marginTop: 2 },
  weekUnit: { color: colors.textMuted, fontSize: 15, fontWeight: '500', letterSpacing: 0 },
  weekStat: { alignItems: 'flex-end' },
  weekStatValue: { color: colors.text, fontSize: 21, fontWeight: '700' },
  weekStatLabel: { color: colors.textMuted, fontSize: 11, marginTop: 3 },
  workoutCard: { gap: spacing.md },
  workoutHeader: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  workoutIcon: { alignItems: 'center', backgroundColor: colors.cyanFill, borderRadius: radius.pill, height: 52, justifyContent: 'center', width: 52 },
  workoutCopy: { flex: 1 },
  workoutTitle: { color: colors.text, fontSize: 17, fontWeight: '600' },
  workoutMeta: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  stats: { borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth, flexDirection: 'row', justifyContent: 'space-between', paddingTop: spacing.md },
  statBlock: { minWidth: 72 },
  stat: { color: colors.text, fontSize: 20, fontWeight: '700', marginTop: 4 },
  notice: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  noticeIcon: { alignItems: 'center', backgroundColor: colors.amberFill, borderRadius: radius.sm, height: 42, justifyContent: 'center', width: 42 },
  noticeCopy: { flex: 1 },
  noticeTitle: { color: colors.text, fontSize: 14, fontWeight: '600' },
  noticeText: { color: colors.textMuted, ...typography.caption, marginTop: 3 },
});
