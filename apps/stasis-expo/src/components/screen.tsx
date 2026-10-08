import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/design/tokens';

export function AppBackdrop() {
  return <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.root]} />;
}

export function Screen({ children, contentContainerStyle, ...props }: PropsWithChildren<ScrollViewProps>) {
  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <ScrollView {...props} contentContainerStyle={[styles.content, contentContainerStyle]} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: colors.background, flex: 1 },
  safe: { flex: 1 },
  content: { alignSelf: 'center', gap: spacing.lg, maxWidth: 680, paddingBottom: 48, paddingHorizontal: 20, paddingTop: 20, width: '100%' },
});
