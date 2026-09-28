import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { Platform, useColorScheme } from 'react-native';
import 'react-native-reanimated';

import { initializeDatabase } from '@/data/database';
import { darkPalette, lightPalette } from '@/design/tokens';

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const webTheme = Platform.OS === 'web' && typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('theme')
    : null;
  const colorScheme = webTheme === 'light' || webTheme === 'dark' ? webTheme : systemColorScheme;
  const isDark = colorScheme === 'dark';
  const palette = isDark ? darkPalette : lightPalette;
  const baseTheme = isDark ? DarkTheme : DefaultTheme;
  const stasisTheme = useMemo(() => ({
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: palette.background,
      border: palette.border,
      card: palette.surfaceSolid,
      primary: palette.blue,
      text: palette.text,
    },
  }), [baseTheme, palette]);

  useEffect(() => {
    initializeDatabase().catch((error: unknown) => {
      console.warn('[stasis-db] initialization failed', error);
    });
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
      Object.entries(palette).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--stasis-${key}`, value);
      });
    }
  }, [isDark, palette]);

  return (
    <ThemeProvider value={stasisTheme}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: palette.background },
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="coach" options={{ presentation: 'formSheet', sheetAllowedDetents: [0.72, 1], sheetCornerRadius: 28, sheetGrabberVisible: true, sheetInitialDetentIndex: 'last' }} />
        <Stack.Screen name="coach-settings" options={{ presentation: 'formSheet', sheetAllowedDetents: [0.78, 1], sheetCornerRadius: 28, sheetGrabberVisible: true, sheetInitialDetentIndex: 'last' }} />
        <Stack.Screen name="illness" options={{ presentation: 'formSheet', sheetAllowedDetents: [0.9, 1], sheetCornerRadius: 28, sheetGrabberVisible: true, sheetInitialDetentIndex: 'last' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
