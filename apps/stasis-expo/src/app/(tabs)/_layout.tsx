import { Tabs } from 'expo-router';
import { Platform, StyleSheet, type ViewStyle } from 'react-native';

import { TabSymbol } from '@/components/tab-symbol';
import { GlassSurface } from '@/components/ui';
import { colors } from '@/design/tokens';

const tabBarShadow = Platform.OS === 'web'
  ? ({ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' } as ViewStyle)
  : ({ shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 24 } as ViewStyle);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
        tabBarActiveTintColor: colors.blue,
        tabBarActiveBackgroundColor: colors.controlFill,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarBackground: () => <GlassSurface style={{ flex: 1 }} />,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderColor: colors.border,
          borderCurve: 'continuous',
          borderRadius: 34,
          borderTopWidth: StyleSheet.hairlineWidth,
          bottom: 22,
          height: 64,
          left: 20,
          overflow: 'hidden',
          paddingBottom: 6,
          paddingHorizontal: 6,
          paddingTop: 6,
          position: 'absolute',
          right: 20,
          ...tabBarShadow,
        },
        tabBarIcon: ({ color, focused, size }) => {
          return <TabSymbol color={color} focused={focused} route={route.name} size={size} />;
        },
        tabBarItemStyle: { borderRadius: 22 },
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
