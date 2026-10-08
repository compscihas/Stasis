import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabSymbol } from '@/components/tab-symbol';
import { GlassSurface } from '@/components/ui';
import { colors } from '@/design/tokens';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
        tabBarActiveTintColor: colors.mint,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarBackground: () => <GlassSurface style={{ flex: 1 }} />,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors.surfaceSolid,
          borderColor: colors.border,
          borderCurve: 'continuous',
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 64 + insets.bottom,
          paddingBottom: Math.max(6, insets.bottom),
          paddingHorizontal: 6,
          paddingTop: 6,
        },
        tabBarIcon: ({ color, focused, size }) => {
          return <TabSymbol color={color} focused={focused} route={route.name} size={size} />;
        },
        tabBarItemStyle: { minWidth: 0 },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      })}
    >
      <Tabs.Screen name="today" options={{ title: 'Today' }} />
      <Tabs.Screen name="sleep" options={{ title: 'Sleep' }} />
      <Tabs.Screen name="heart" options={{ title: 'Heart' }} />
      <Tabs.Screen name="workouts" options={{ title: 'Workouts' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
