import { SymbolView } from 'expo-symbols';
import type { ColorValue } from 'react-native';

const symbols = {
  today: ['sun.max', 'sun.max.fill'],
  sleep: ['moon', 'moon.fill'],
  heart: ['heart', 'heart.fill'],
  workouts: ['dumbbell', 'dumbbell.fill'],
  profile: ['person', 'person.fill'],
} as const;

export function TabSymbol({ route, focused, color, size }: { route: string; focused: boolean; color: ColorValue; size: number }) {
  const pair = symbols[route as keyof typeof symbols] ?? symbols.today;
  return <SymbolView name={focused ? pair[1] : pair[0]} size={size} tintColor={color} type="hierarchical" weight="regular" />;
}
