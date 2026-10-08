import { Color } from 'expo-router';
import { DynamicColorIOS, Platform, type ColorValue, type TextStyle } from 'react-native';

export const lightPalette = {
  background: '#FFFFFF',
  backgroundTop: '#FFFFFF',
  backgroundMiddle: '#FFFFFF',
  surface: '#F7F9FA',
  surfaceRaised: 'rgba(120, 120, 128, 0.12)',
  surfaceSolid: '#FFFFFF',
  glass: '#F7F9FA',
  glassStrong: '#F0F4F6',
  border: '#E3E8ED',
  borderStrong: 'rgba(60, 60, 67, 0.18)',
  text: '#17212B',
  textMuted: '#566372',
  textFaint: '#657383',
  blue: '#1769BB',
  cyan: '#32ADE6',
  coral: '#FF3B30',
  peach: '#FF6B4A',
  purple: '#AF52DE',
  mint: '#168C59',
  amber: '#A56100',
  danger: '#FF3B30',
  controlFill: 'rgba(120, 120, 128, 0.16)',
  controlFillStrong: 'rgba(255, 255, 255, 0.86)',
  blueFill: 'rgba(0, 122, 255, 0.14)',
  blueFillStrong: '#1769BB',
  cyanFill: 'rgba(50, 173, 230, 0.14)',
  mintFill: '#EFF9F4',
  amberFill: 'rgba(255, 149, 0, 0.14)',
  dangerFill: 'rgba(255, 59, 48, 0.12)',
  ringTrack: 'rgba(60, 60, 67, 0.12)',
  ambientPrimary: '#7AB8FF',
  ambientSecondary: '#C9A7FF',
  ambientTertiary: '#FFB38A',
} as const;

export const darkPalette = {
  background: '#111416',
  backgroundTop: '#111416',
  backgroundMiddle: '#111416',
  surface: 'rgba(255, 255, 255, 0.08)',
  surfaceRaised: 'rgba(255, 255, 255, 0.10)',
  surfaceSolid: '#1B2023',
  glass: '#1B2023',
  glassStrong: '#252C30',
  border: '#343C42',
  borderStrong: 'rgba(255, 255, 255, 0.30)',
  text: '#FFFFFF',
  textMuted: '#ADB8C2',
  textFaint: '#96A3AF',
  blue: '#80BFFF',
  cyan: '#64D2FF',
  coral: '#FF453A',
  peach: '#FF9F7A',
  purple: '#BF5AF2',
  mint: '#56DCA0',
  amber: '#FF9F0A',
  danger: '#FF453A',
  controlFill: 'rgba(120, 120, 128, 0.24)',
  controlFillStrong: 'rgba(255, 255, 255, 0.18)',
  blueFill: 'rgba(10, 132, 255, 0.22)',
  blueFillStrong: '#1769BB',
  cyanFill: 'rgba(100, 210, 255, 0.16)',
  mintFill: '#172C23',
  amberFill: 'rgba(255, 159, 10, 0.16)',
  dangerFill: 'rgba(255, 69, 58, 0.16)',
  ringTrack: 'rgba(255, 255, 255, 0.12)',
  ambientPrimary: '#0A84FF',
  ambientSecondary: '#BF5AF2',
  ambientTertiary: '#FF375F',
} as const;

type PaletteKey = keyof typeof darkPalette;

const androidSemantic: Partial<Record<PaletteKey, ColorValue>> = Platform.OS === 'android'
  ? {
      background: Color.android.dynamic.background,
      backgroundTop: Color.android.dynamic.surfaceContainerLow,
      backgroundMiddle: Color.android.dynamic.surface,
      surface: Color.android.dynamic.surfaceContainer,
      surfaceRaised: Color.android.dynamic.surfaceContainerHigh,
      surfaceSolid: Color.android.dynamic.surfaceContainerLowest,
      glass: Color.android.dynamic.surfaceContainer,
      glassStrong: Color.android.dynamic.surfaceContainerHigh,
      border: Color.android.dynamic.outlineVariant,
      borderStrong: Color.android.dynamic.outline,
      text: Color.android.dynamic.onBackground,
      textMuted: Color.android.dynamic.onSurfaceVariant,
      textFaint: Color.android.dynamic.outline,
      blue: Color.android.dynamic.primary,
      cyan: Color.android.dynamic.tertiary,
      coral: Color.android.dynamic.error,
      peach: Color.android.dynamic.tertiary,
      purple: Color.android.dynamic.secondary,
      mint: Color.android.dynamic.primary,
      amber: Color.android.dynamic.tertiary,
      danger: Color.android.dynamic.error,
      controlFill: Color.android.dynamic.surfaceContainerHigh,
      controlFillStrong: Color.android.dynamic.surfaceContainerHighest,
      blueFill: Color.android.dynamic.primaryContainer,
      cyanFill: Color.android.dynamic.tertiaryContainer,
      mintFill: Color.android.dynamic.secondaryContainer,
      amberFill: Color.android.dynamic.tertiaryContainer,
      dangerFill: Color.android.dynamic.errorContainer,
      ringTrack: Color.android.dynamic.outlineVariant,
      ambientPrimary: Color.android.dynamic.outline,
      ambientSecondary: Color.android.dynamic.outlineVariant,
      ambientTertiary: Color.android.dynamic.tertiary,
    }
  : {};

function adaptive(key: PaletteKey): ColorValue {
  const light = lightPalette[key];
  const dark = darkPalette[key];
  if (Platform.OS === 'ios') return DynamicColorIOS({ light, dark });
  if (Platform.OS === 'android') return androidSemantic[key] ?? dark;
  return `var(--stasis-${key}, ${light})`;
}

export const colors = Object.fromEntries(
  (Object.keys(darkPalette) as PaletteKey[]).map((key) => [key, adaptive(key)]),
) as Record<PaletteKey, ColorValue>;

export const typeface: TextStyle = Platform.OS === 'web'
  ? { fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, sans-serif' }
  : {};

export const spacing = { xs: 6, sm: 10, md: 16, lg: 22, xl: 32, xxl: 44 } as const;
export const radius = { sm: 6, md: 8, lg: 8, pill: 999 } as const;
export const typography = {
  largeTitle: { ...typeface, fontSize: 30, fontWeight: '700' as const, letterSpacing: 0, lineHeight: 36 },
  title1: { ...typeface, fontSize: 26, fontWeight: '700' as const, letterSpacing: 0, lineHeight: 32 },
  title2: { ...typeface, fontSize: 18, fontWeight: '600' as const, letterSpacing: 0, lineHeight: 24 },
  title3: { ...typeface, fontSize: 18, fontWeight: '600' as const, letterSpacing: 0, lineHeight: 24 },
  headline: { ...typeface, fontSize: 16, fontWeight: '600' as const, letterSpacing: 0, lineHeight: 22 },
  body: { ...typeface, fontSize: 16, fontWeight: '400' as const, letterSpacing: 0, lineHeight: 22 },
  callout: { ...typeface, fontSize: 15, fontWeight: '400' as const, letterSpacing: 0, lineHeight: 21 },
  subhead: { ...typeface, fontSize: 14, fontWeight: '400' as const, letterSpacing: 0, lineHeight: 20 },
  footnote: { ...typeface, fontSize: 13, fontWeight: '400' as const, letterSpacing: 0, lineHeight: 18 },
  caption: { ...typeface, fontSize: 12, fontWeight: '500' as const, letterSpacing: 0, lineHeight: 16 },
} as const;
