import Ionicons from '@expo/vector-icons/Ionicons';
import type { ColorValue } from 'react-native';

const icons = {
  today: ['sunny-outline', 'sunny'],
  sleep: ['moon-outline', 'moon'],
  heart: ['heart-outline', 'heart'],
  workouts: ['barbell-outline', 'barbell'],
  profile: ['person-outline', 'person'],
} as const;

export function TabSymbol({ route, focused, color, size }: { route: string; focused: boolean; color: ColorValue; size: number }) {
  const pair = icons[route as keyof typeof icons] ?? icons.today;
  return <Ionicons color={color} name={focused ? pair[1] : pair[0]} size={size} />;
}
