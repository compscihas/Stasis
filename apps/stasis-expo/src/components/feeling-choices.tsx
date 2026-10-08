import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import { TactilePressable } from '@/components/ui';
import type { FeelingStatus } from '@/data/symptom-model';
import { colors, radius } from '@/design/tokens';

const choices = [
  { value: 'normal', label: 'Normal', icon: 'happy-outline' },
  { value: 'off', label: 'Feeling off', icon: 'remove-circle-outline' },
  { value: 'sick', label: 'Sick', icon: 'sad-outline' },
] as const;

export function FeelingChoices({ value, onChange }: { value: FeelingStatus | null; onChange: (value: FeelingStatus) => void }) {
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel="How are you feeling?" style={styles.choices}>
      {choices.map((choice) => (
        <TactilePressable key={choice.value} accessibilityRole="radio" accessibilityLabel={choice.label} accessibilityState={{ checked: value === choice.value }} aria-checked={value === choice.value}
          onPress={() => onChange(choice.value)} style={[styles.choice, value === choice.value && styles.active]}>
          <Ionicons name={choice.icon} color={colors.blue} size={24} />
          <Text style={styles.label}>{choice.label}</Text>
        </TactilePressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  choices: { flexDirection: 'row', gap: 8 },
  choice: { alignItems: 'center', backgroundColor: colors.blueFill, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, flex: 1, gap: 8, justifyContent: 'center', minHeight: 80, minWidth: 0, paddingHorizontal: 4, paddingVertical: 12 },
  active: { borderColor: colors.blue, borderWidth: 2 },
  label: { color: colors.blue, fontSize: 13, fontWeight: '500', textAlign: 'center' },
});
