import { LinearGradient } from 'expo-linear-gradient';
import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, useColorScheme, type ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/design/tokens';

export function AppBackdrop() {
  const dark = useColorScheme() === 'dark';
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={dark
          ? ['#18263C', '#101927', '#0D121D', '#0A0D14']
          : ['#F8FAFD', '#ECF2F8', '#EDF0F4', '#F7F4EF']}
        locations={[0, 0.32, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={dark
          ? ['rgba(99, 149, 214, 0.14)', 'rgba(63, 105, 173, 0.05)', 'transparent']
          : ['rgba(119, 171, 236, 0.22)', 'rgba(166, 199, 239, 0.08)', 'transparent']}
        locations={[0, 0.42, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.8 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={dark
          ? ['transparent', 'rgba(115, 75, 134, 0.04)', 'rgba(143, 77, 100, 0.08)']
          : ['transparent', 'rgba(176, 152, 206, 0.04)', 'rgba(241, 198, 165, 0.12)']}
        locations={[0, 0.56, 1]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

export function Screen({ children, ...props }: PropsWithChildren<ScrollViewProps>) {
  return (
    <View style={styles.root}>
      <AppBackdrop />
      <SafeAreaView edges={['top']} style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} {...props}>
          {children}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: colors.background, flex: 1, overflow: 'hidden' },
  safe: { flex: 1 },
  content: { gap: spacing.md, paddingBottom: 128, paddingHorizontal: spacing.md, paddingTop: 4 },
});
