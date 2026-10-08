import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import type { PropsWithChildren, ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type ColorValue, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { colors, radius, spacing, typeface, typography } from '@/design/tokens';

const SpringPressable = Animated.createAnimatedComponent(Pressable);

export function TactilePressable({ haptic = 'selection', onPress, onPressIn, onPressOut, style, disabled, ...props }: Omit<PressableProps, 'style'> & { haptic?: 'selection' | 'light' | 'none'; style?: StyleProp<ViewStyle> }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <SpringPressable {...props} accessibilityRole={props.accessibilityRole ?? 'button'} disabled={disabled}
      onPress={(event) => {
        if (!disabled && Platform.OS !== 'web' && haptic !== 'none') {
          if (haptic === 'light') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          else void Haptics.selectionAsync();
        }
        onPress?.(event);
      }}
      onPressIn={(event) => { scale.value = withSpring(0.98); onPressIn?.(event); }}
      onPressOut={(event) => { scale.value = withSpring(1); onPressOut?.(event); }}
      style={[style, animatedStyle]} />
  );
}

export function GlassCluster({ children, style }: PropsWithChildren<{ spacing?: number; style?: StyleProp<ViewStyle> }>) {
  return <View style={style}>{children}</View>;
}

// Retain the shared surface API while screens move to opaque adaptive surfaces.
export function GlassSurface({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle>; interactive?: boolean; tintColor?: string; clear?: boolean }>) {
  return <View style={[styles.surface, style]}>{children}</View>;
}

export function Card({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.section, style]}>{children}</View>;
}

export function Tile({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.tile, style]}>{children}</View>;
}

export function Eyebrow({ children }: PropsWithChildren) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

export function SectionTitle({ children, action }: PropsWithChildren<{ action?: ReactNode }>) {
  return <View style={styles.sectionRow}><Text style={styles.sectionTitle}>{children}</Text>{action}</View>;
}

export function ScreenTitle({ children, action }: PropsWithChildren<{ action?: ReactNode }>) {
  return (
    <View style={styles.titleRow}>
      <View style={styles.titleCopy}>
        <Text style={styles.brand}>Stasis AI</Text>
        <Text style={styles.title}>{children}</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</Text>
      </View>
      {action}
    </View>
  );
}

export function IconButton({ icon, onPress, accessibilityLabel }: { icon: keyof typeof Ionicons.glyphMap; onPress: () => void; accessibilityLabel: string; tintColor?: string }) {
  return <TactilePressable accessibilityLabel={accessibilityLabel} haptic="light" onPress={onPress} style={styles.iconButton}><Ionicons color={colors.text} name={icon} size={21} /></TactilePressable>;
}

export function GlassButton({ children, icon, onPress, disabled, primary = false, style }: PropsWithChildren<{ icon?: keyof typeof Ionicons.glyphMap; onPress?: () => void; disabled?: boolean; primary?: boolean; style?: StyleProp<ViewStyle> }>) {
  return (
    <TactilePressable disabled={disabled} haptic={primary ? 'light' : 'selection'} onPress={onPress} style={[styles.button, primary && styles.primaryButton, disabled && styles.disabled, style]}>
      {icon ? <Ionicons color={primary ? '#FFFFFF' : colors.blue} name={icon} size={18} /> : null}
      <Text style={[styles.buttonText, primary && styles.primaryButtonText]}>{children}</Text>
    </TactilePressable>
  );
}

export function MetricCard({ label, value, unit, accent = colors.blue, icon }: { label: string; value: string; unit?: string; accent?: ColorValue; icon?: keyof typeof Ionicons.glyphMap }) {
  return (
    <Tile style={styles.metricCard}>
      <View style={styles.metricHeader}>{icon ? <Ionicons color={accent} name={icon} size={18} /> : null}<Text style={styles.metricLabel}>{label}</Text></View>
      <View style={styles.metricValueRow}><Text style={styles.metricValue}>{value}</Text>{unit ? <Text style={styles.metricUnit}>{unit}</Text> : null}</View>
    </Tile>
  );
}

export function MetricRow({ label, value, unit, icon, accent = colors.blue }: { label: string; value: string; unit?: string; icon: keyof typeof Ionicons.glyphMap; accent?: ColorValue }) {
  return (
    <View style={styles.metricRow}>
      <Ionicons color={accent} name={icon} size={22} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}{unit ? <Text style={styles.metricUnit}> {unit}</Text> : null}</Text>
    </View>
  );
}

export function ReadinessRing({ value, compact = false }: { value: number | null; compact?: boolean }) {
  const size = compact ? 76 : 136;
  const stroke = compact ? 7 : 10;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const bounded = Math.max(0, Math.min(100, value ?? 0));
  return (
    <View accessibilityLabel={`Readiness ${value ?? 'unavailable'}`} style={[styles.ringWrap, { height: size, width: size }]}>
      <Svg height={size} style={StyleSheet.absoluteFill} width={size}>
        <Circle cx={size / 2} cy={size / 2} fill="none" r={r} stroke={colors.ringTrack} strokeWidth={stroke} />
        <Circle cx={size / 2} cy={size / 2} fill="none" r={r} stroke={colors.mint} strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={circumference * (1 - bounded / 100)} strokeLinecap="round" strokeWidth={stroke} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </Svg>
      <Text style={[styles.ringValue, compact && styles.compactRingValue]}>{value ?? '\u2014'}</Text>
    </View>
  );
}

export function PreviewBadge() {
  return <View style={styles.previewBadge}><Text style={styles.previewText}>Preview</Text></View>;
}

const styles = StyleSheet.create({
  surface: { backgroundColor: colors.surfaceSolid, overflow: 'hidden' },
  section: { gap: spacing.sm },
  tile: { backgroundColor: colors.surfaceSolid, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, padding: spacing.md },
  eyebrow: { color: colors.textMuted, fontSize: 11, fontWeight: '600', letterSpacing: 0, textTransform: 'uppercase', ...typeface },
  sectionRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between' },
  sectionTitle: { color: colors.text, ...typography.title2 },
  titleRow: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between' },
  titleCopy: { flex: 1, minWidth: 0 },
  brand: { color: colors.text, fontSize: 17, fontWeight: '600', marginBottom: 12, ...typeface },
  title: { color: colors.text, ...typography.largeTitle },
  date: { color: colors.textMuted, ...typography.footnote, marginTop: 4 },
  iconButton: { alignItems: 'center', backgroundColor: colors.controlFill, borderRadius: radius.md, height: 44, justifyContent: 'center', width: 44 },
  button: { alignItems: 'center', backgroundColor: colors.blueFill, borderRadius: radius.md, flexDirection: 'row', gap: spacing.xs, justifyContent: 'center', minHeight: 46, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  primaryButton: { backgroundColor: colors.blueFillStrong },
  buttonText: { color: colors.blue, flexShrink: 1, fontSize: 15, fontWeight: '600', textAlign: 'center', ...typeface },
  primaryButtonText: { color: '#FFFFFF' },
  disabled: { opacity: 0.45 },
  metricCard: { flex: 1, minWidth: 0, minHeight: 96 },
  metricHeader: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs },
  metricLabel: { color: colors.textMuted, flexShrink: 1, fontSize: 13, ...typeface },
  metricValueRow: { alignItems: 'baseline', flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  metricValue: { color: colors.text, fontSize: 24, fontWeight: '600', letterSpacing: 0, ...typeface },
  metricUnit: { color: colors.textMuted, fontSize: 13, fontWeight: '400', marginLeft: 4, ...typeface },
  metricRow: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', gap: 12, minHeight: 56, paddingVertical: 12 },
  rowLabel: { color: colors.textMuted, flex: 1, fontSize: 14, ...typeface },
  rowValue: { color: colors.text, fontSize: 18, fontWeight: '600', ...typeface },
  ringWrap: { alignItems: 'center', justifyContent: 'center' },
  ringValue: { color: colors.text, fontSize: 40, fontWeight: '700', ...typeface },
  compactRingValue: { fontSize: 25 },
  previewBadge: { backgroundColor: colors.controlFill, borderRadius: radius.md, paddingHorizontal: 10, paddingVertical: 6 },
  previewText: { color: colors.textMuted, fontSize: 11, ...typeface },
});
