import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, Text, View, type ColorValue } from 'react-native';

import { Screen } from '@/components/screen';
import { Card, PreviewBadge, ScreenTitle, SectionTitle, TactilePressable } from '@/components/ui';
import { colors, radius, spacing, typography } from '@/design/tokens';
import { bleCapability } from '@/native/ble-client';

function SettingRow({ icon, color, title, subtitle, onPress, last = false }: { icon: keyof typeof Ionicons.glyphMap; color: ColorValue; title: string; subtitle: string; onPress?: () => void; last?: boolean }) {
  return (
    <TactilePressable disabled={!onPress} onPress={onPress} style={[styles.settingRow, last && styles.lastRow]}>
      <View style={[styles.settingIcon, { backgroundColor: colors.controlFill }]}><Ionicons color={color} name={icon} size={18} /></View>
      <View style={styles.settingCopy}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      {onPress ? <Ionicons color={colors.textFaint} name="chevron-forward" size={17} /> : null}
    </TactilePressable>
  );
}

export default function ProfileScreen() {
  const ble = bleCapability();
  return (
    <Screen>
      <ScreenTitle action={<PreviewBadge />}>Profile</ScreenTitle>
      <Card style={styles.deviceCard}>
        <View style={styles.deviceIcon}><Ionicons color={colors.cyan} name="watch-outline" size={31} /></View>
        <View style={styles.deviceCopy}>
          <Text style={styles.deviceName}>Stasis Band</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: ble.available ? colors.mint : colors.amber }]} />
            <Text style={styles.connection}>{ble.available ? 'Development build ready' : 'Preview mode'}</Text>
          </View>
        </View>
        {!ble.available ? <Text style={styles.deviceHint}>{ble.reason}</Text> : null}
      </Card>

      <SectionTitle>Intelligence</SectionTitle>
      <Card style={styles.settingsCard}>
        <SettingRow color={colors.purple} icon="sparkles" title="Stasis Coach" subtitle="Private, self-hosted guidance" onPress={() => router.push('/coach')} />
        <SettingRow color={colors.cyan} icon="server-outline" title="Coach server" subtitle="Tailscale · qwen2.5-coder:3b" onPress={() => router.push('/coach-settings')} />
        <SettingRow color={colors.blue} icon="cloud-upload-outline" title="Self-hosted mirror" subtitle="Off · explicit consent required" last />
      </Card>

      <SectionTitle>Health & privacy</SectionTitle>
      <Card style={styles.settingsCard}>
        <SettingRow color={colors.coral} icon="heart" title="Apple Health" subtitle="Not connected" />
        <SettingRow color={colors.mint} icon="medical" title="Illness Watch" subtitle="Local symptom reports and feedback" onPress={() => router.push('/illness')} />
        <SettingRow color={colors.amber} icon="notifications" title="Notifications" subtitle="Recovery, device and reminders" />
        <SettingRow color={colors.blue} icon="shield-checkmark" title="Privacy" subtitle="Local-first controls and exports" last />
      </Card>

      <Text style={styles.footer}>Stasis AI · Your data stays yours</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  deviceCard: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, paddingBottom: spacing.lg },
  deviceIcon: { alignItems: 'center', backgroundColor: colors.cyanFill, borderColor: colors.borderStrong, borderRadius: radius.pill, borderWidth: StyleSheet.hairlineWidth, height: 64, justifyContent: 'center', width: 64 },
  deviceCopy: { flex: 1 },
  deviceName: { color: colors.text, fontSize: 20, fontWeight: '600', letterSpacing: 0 },
  statusRow: { alignItems: 'center', flexDirection: 'row', gap: 7, marginTop: 6 },
  statusDot: { borderRadius: radius.pill, height: 7, width: 7 },
  connection: { color: colors.textMuted, fontSize: 12, fontWeight: '500' },
  deviceHint: { color: colors.textMuted, flexBasis: '100%', ...typography.caption, marginTop: spacing.xs },
  settingsCard: { gap: 0 },
  settingRow: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', gap: spacing.md, minHeight: 70, paddingVertical: 11 },
  lastRow: { borderBottomWidth: 0 },
  settingIcon: { alignItems: 'center', borderRadius: radius.md, height: 34, justifyContent: 'center', width: 34 },
  settingCopy: { flex: 1 },
  settingTitle: { color: colors.text, fontSize: 15, fontWeight: '600' },
  settingSubtitle: { color: colors.textMuted, fontSize: 11, marginTop: 3 },
  footer: { color: colors.textFaint, fontSize: 11, marginTop: spacing.md, textAlign: 'center' },
});
