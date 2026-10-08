import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import IllnessScreen from '@/app/illness';
import { FeelingChoices } from '@/components/feeling-choices';
import { getSymptomCheckin, recentSymptomCheckins, saveSymptomCheckin } from '@/data/symptom-repository';
import { localDayId, type SymptomCheckin } from '@/data/symptom-model';

let mockFeeling: string | undefined;

jest.mock('expo-router', () => ({
  router: { back: jest.fn() },
  useLocalSearchParams: () => ({ feeling: mockFeeling }),
  useFocusEffect: (callback: () => void) => require('react').useEffect(callback, [callback]),
}));
jest.mock('@expo/vector-icons/Ionicons', () => 'Icon');
jest.mock('@/components/screen', () => ({ Screen: require('react-native').View }));
jest.mock('@/components/ui', () => {
  const { Pressable, Text, View } = require('react-native');
  return {
    Card: View,
    Eyebrow: Text,
    IconButton: () => null,
    TactilePressable: Pressable,
    GlassButton: ({ children, ...props }: { children: React.ReactNode }) => <Pressable {...props}><Text>{children}</Text></Pressable>,
  };
});
jest.mock('@/data/symptom-repository', () => ({
  getSymptomCheckin: jest.fn(),
  recentSymptomCheckins: jest.fn().mockResolvedValue([]),
  recentIllnessSignals: jest.fn().mockResolvedValue([]),
  saveSymptomCheckin: jest.fn(),
}));

const normal: SymptomCheckin = { dayId: localDayId(), status: 'normal', symptoms: [], severity: null, onsetAt: null, temperatureC: null, testStatus: null, confounders: [], note: '', createdAt: 1, updatedAt: 1 };

beforeEach(() => {
  mockFeeling = undefined;
  jest.clearAllMocks();
  jest.mocked(recentSymptomCheckins).mockResolvedValue([normal]);
  jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
});
afterEach(() => jest.restoreAllMocks());

it('leaves the day unlabeled until a feeling is explicitly selected', async () => {
  const onChange = jest.fn();
  await render(<FeelingChoices value={null} onChange={onChange} />);
  for (const label of ['Normal', 'Feeling off', 'Sick']) {
    expect(screen.getByRole('radio', { name: label }).props.accessibilityState.checked).toBe(false);
  }
  await fireEvent.press(screen.getByRole('radio', { name: 'Feeling off' }));
  expect(onChange).toHaveBeenCalledWith('off');
  expect(saveSymptomCheckin).not.toHaveBeenCalled();
});

it('opens the form with the chosen feeling even when a different label is saved', async () => {
  mockFeeling = 'off';
  jest.mocked(getSymptomCheckin).mockResolvedValue(normal);
  await render(<IllnessScreen />);
  await waitFor(() => expect(screen.getByRole('radio', { name: 'Feeling off' }).props.accessibilityState.checked).toBe(true));
  expect(saveSymptomCheckin).not.toHaveBeenCalled();
  await fireEvent.press(screen.getByText('Update today\u2019s check-in'));
  expect(Alert.alert).toHaveBeenCalledWith('Add severity', expect.any(String));
  expect(saveSymptomCheckin).not.toHaveBeenCalled();
});

it('retains an edited feeling after saving instead of reapplying the navigation choice', async () => {
  mockFeeling = 'off';
  jest.mocked(getSymptomCheckin).mockResolvedValue(normal);
  jest.mocked(saveSymptomCheckin).mockResolvedValue(normal);
  await render(<IllnessScreen />);
  await waitFor(() => expect(screen.getByRole('radio', { name: 'Feeling off' }).props.accessibilityState.checked).toBe(true));
  await fireEvent.press(screen.getByRole('radio', { name: 'Normal' }));
  await fireEvent.press(screen.getByText('Update today\u2019s check-in'));
  await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith('Check-in saved', expect.any(String)));
  expect(saveSymptomCheckin).toHaveBeenCalledWith(expect.objectContaining({ status: 'normal', dayId: normal.dayId }));
  expect(screen.getByRole('radio', { name: 'Normal' }).props.accessibilityState.checked).toBe(true);
});
