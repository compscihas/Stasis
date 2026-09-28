import Ionicons from '@expo/vector-icons/Ionicons';
import { GlassView, isGlassEffectAPIAvailable } from 'expo-glass-effect';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import type { PropsWithChildren, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  type ColorValue,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { colors, darkPalette, lightPalette, radius, spacing, typeface, typography } from '@/design/tokens';

function canUseNativeGlass() {
  if (Platform.OS !== 'ios') return false;
  try {
    return isGlassEffectAPIAvailable();
  } catch {
    return false;
  }
}

function useReduceTransparency() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const info = AccessibilityInfo as typeof AccessibilityInfo & {
      isReduceTransparencyEnabled?: () => Promise<boolean>;
    };
    void info.isReduceTransparencyEnabled?.().then(setReduce);
    const sub = AccessibilityInfo.addEventListener('reduceTransparencyChanged' as 'change', setReduce as never);
    return () => sub.remove();
  }, []);
  return reduce;
}

const webGlass = Platform.OS === 'web'
  ? ({ backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)' } as ViewStyle)
  : undefined;

const glassShadow = Platform.OS === 'web'
  ? ({ boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)' } as ViewStyle)
  : ({ shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 20 } as ViewStyle);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TactilePressable({
  haptic = 'selection',
  onPress,
  onPressIn,
  onPressOut,
  style,
  disabled,
  ...props
}: Omit<PressableProps, 'style'> & {
  haptic?: 'selection' | 'light' | 'none';
  style?: StyleProp<ViewStyle>;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      {...props}
      disabled={disabled}
      onPress={(event) => {
        if (!disabled && Platform.OS !== 'web' && haptic !== 'none') {
          if (haptic === 'light') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          else void Haptics.selectionAsync();
        }
        onPress?.(event);
      }}
      onPressIn={(event) => {
        scale.value = withSpring(0.97, { damping: 18, mass: 0.45, stiffness: 320 });
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.value = withSpring(1, { damping: 17, mass: 0.45, stiffness: 300 });
        onPressOut?.(event);
      }}
      style={[style, animatedStyle]}
    />
  );
}

export function GlassCluster({
  children,
  style,
}: PropsWithChildren<{ spacing?: number; style?: StyleProp<ViewStyle> }>) {
  return <View style={style}>{children}</View>;
}

export function GlassSurface({
  children,
  style,
  interactive = false,
  tintColor,
  clear = false,
}: PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  interactive?: boolean;
  tintColor?: string;
  clear?: boolean;
}>) {
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const reduceTransparency = useReduceTransparency();
  const native = canUseNativeGlass() && !reduceTransparency;
  const specular = colorScheme === 'dark'
    ? (['rgba(255,255,255,0.16)', 'rgba(255,255,255,0.04)', 'transparent'] as const)
    : (['rgba(255,255,255,0.7)', 'rgba(255,255,255,0.16)', 'transparent'] as const);

  const inner = (
    <>
      {native ? null : (
        <LinearGradient colors={[...specular]} locations={[0, 0.28, 0.7]} pointerEvents="none" style={styles.specular} />
      )}
      {children}
    </>
  );

  if (native) {
    return (
      <GlassView
        colorScheme={colorScheme}
        glassEffectStyle={clear ? 'clear' : 'regular'}
        isInteractive={interactive}
        style={[styles.glassBase, style]}
        tintColor={tintColor}
      >
        {inner}
      </GlassView>
    );
  }

  return (
    <View style={[styles.glassBase, reduceTransparency ? styles.glassSolid : styles.glassFallback, webGlass, style]}>
      {inner}
    </View>
  );
}

export function Card({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <GlassSurface style={[styles.card, glassShadow, style]}>{children}</GlassSurface>;
}

export function Eyebrow({ children }: PropsWithChildren) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

export function SectionTitle({ children, action }: PropsWithChildren<{ action?: ReactNode }>) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{children}</Text>
      {action}
    </View>
  );
}

export function ScreenTitle({ children, action }: PropsWithChildren<{ action?: ReactNode }>) {
  return (
    <View style={styles.titleRow}>
      <View style={styles.titleCopy}>
        <Text style={styles.title}>{children}</Text>
      </View>
      {action}
    </View>
  );
}

export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  tintColor,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  accessibilityLabel: string;
  tintColor?: string;
}) {
  return (
    <GlassSurface clear interactive style={styles.iconGlass} tintColor={tintColor}>
      <TactilePressable accessibilityLabel={accessibilityLabel} haptic="light" onPress={onPress} style={styles.iconPressable}>
        <Ionicons color={colors.text} name={icon} size={20} />
      </TactilePressable>
    </GlassSurface>
  );
}

export function GlassButton({
  children,
  icon,
  onPress,
  disabled,
  primary = false,
  style,
}: PropsWithChildren<{
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  disabled?: boolean;
  primary?: boolean;
  style?: StyleProp<ViewStyle>;
}>) {
  const primaryTint = useColorScheme() === 'dark' ? darkPalette.blue : lightPalette.blue;
  return (
    <GlassSurface interactive style={[styles.buttonGlass, disabled && styles.disabled, style]} tintColor={primary ? primaryTint : undefined}>
      <TactilePressable disabled={disabled} haptic={primary ? 'light' : 'selection'} onPress={onPress} style={styles.buttonPressable}>
        {icon ? <Ionicons color={primary ? '#FFFFFF' : colors.blue} name={icon} size={17} /> : null}
        <Text style={[styles.buttonText, primary && styles.primaryButtonText]}>{children}</Text>
      </TactilePressable>
    </GlassSurface>
  );
}

export function MetricCard({
  label,
  value,
  unit,
  accent = colors.blue,
  icon,
}: {
  label: string;
  value: string;
  unit?: string;
  accent?: ColorValue;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <Card style={styles.metricCard}>
      <View style={styles.metricHeader}>
        {icon ? <Ionicons color={accent} name={icon} size={16} /> : null}
        <Eyebrow>{label}</Eyebrow>
      </View>
      <View style={styles.metricValueRow}>
        <Text style={styles.metricValue}>{value}</Text>
        {unit ? <Text style={styles.metricUnit}>{unit}</Text> : null}
      </View>
      <View style={[styles.metricAccent, { backgroundColor: accent }]} />
    </Card>
  );
}

export function ReadinessRing({ value }: { value: number | null }) {
  const size = 188;
  const stroke = 14;
  const radiusValue = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radiusValue;
  const bounded = Math.max(0, Math.min(100, value ?? 0));
  const dashOffset = circumference * (1 - bounded / 100);

  return (
    <View style={styles.ringWrap}>
      <Svg height={size} style={StyleSheet.absoluteFill} width={size}>
        <Circle cx={size / 2} cy={size / 2} fill="none" r={radiusValue} stroke={colors.ringTrack} strokeWidth={stroke} />
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radiusValue}
          stroke={colors.cyan}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          strokeWidth={stroke}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text style={styles.ringLabel}>Readiness</Text>
      <Text style={styles.ringValue}>{value ?? '—'}</Text>
      <Text style={styles.ringCaption}>{value == null ? 'Calibrating' : 'Steady today'}</Text>
    </View>
  );
}

export function PreviewBadge() {
  return (
    <GlassSurface clear style={styles.previewBadge}>
      <View style={styles.previewDot} />
      <Text style={styles.previewText}>Preview</Text>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  glassBase: { borderCurve: 'continuous', overflow: 'hidden' },
  glassFallback: {
    backgroundColor: colors.glass,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
  },
  glassSolid: {
    backgroundColor: colors.surfaceSolid,
    borderColor: colors.borderStrong,
    borderWidth: StyleSheet.hairlineWidth,
  },
  specular: { height: '55%', left: 0, position: 'absolute', right: 0, top: 0 },
  card: {
    borderCurve: 'continuous',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  eyebrow: { color: colors.textMuted, fontSize: 12, fontWeight: '600', letterSpacing: 0.4, textTransform: 'uppercase', ...typeface },
  sectionRow: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, paddingHorizontal: 4 },
  sectionTitle: { color: colors.text, ...typography.title2 },
  titleRow: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4, minHeight: 52 },
  titleCopy: { flex: 1 },
  title: { color: colors.text, ...typography.largeTitle },
  iconGlass: { borderCurve: 'continuous', borderRadius: radius.pill, height: 44, width: 44 },
  iconPressable: { alignItems: 'center', height: '100%', justifyContent: 'center', width: '100%' },
  buttonGlass: { borderCurve: 'continuous', borderRadius: radius.pill, minHeight: 50 },
  buttonPressable: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs, justifyContent: 'center', minHeight: 50, paddingHorizontal: spacing.lg },
  buttonText: { color: colors.blue, fontSize: 17, fontWeight: '600', ...typeface },
  primaryButtonText: { color: '#FFFFFF' },
  disabled: { opacity: 0.38 },
  metricCard: { flex: 1, minHeight: 124 },
  metricHeader: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs },
  metricValueRow: { alignItems: 'baseline', flexDirection: 'row', marginTop: 8 },
  metricValue: { color: colors.text, fontSize: 34, fontWeight: '700', letterSpacing: 0.37, ...typeface },
  metricUnit: { color: colors.textMuted, fontSize: 15, fontWeight: '400', marginLeft: 4, ...typeface },
  metricAccent: { borderRadius: radius.pill, height: 4, marginTop: 'auto', width: 28 },
  ringWrap: { alignItems: 'center', alignSelf: 'center', height: 188, justifyContent: 'center', width: 188 },
  ringLabel: { color: colors.textMuted, fontSize: 13, fontWeight: '600', ...typeface },
  ringValue: { color: colors.text, fontSize: 56, fontWeight: '700', letterSpacing: 0.4, lineHeight: 62, ...typeface },
  ringCaption: { color: colors.cyan, fontSize: 15, fontWeight: '600', ...typeface },
  previewBadge: { alignItems: 'center', borderCurve: 'continuous', borderRadius: radius.pill, flexDirection: 'row', gap: 6, paddingHorizontal: 12, paddingVertical: 8 },
  previewDot: { backgroundColor: colors.mint, borderRadius: radius.pill, height: 6, width: 6 },
  previewText: { color: colors.text, fontSize: 13, fontWeight: '600', ...typeface },
});
