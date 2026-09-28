import { router } from 'expo-router';
import { useEffect, useState, type ComponentProps } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '@/components/screen';
import { Card, Eyebrow, GlassButton, IconButton } from '@/components/ui';
import { colors, radius, spacing } from '@/design/tokens';
import { checkCoachHealth } from '@/services/coach-client';
import { defaultCoachConfig, loadCoachConfig, saveCoachConfig } from '@/services/coach-config';

export default function CoachSettingsScreen() {
  const [baseUrl, setBaseUrl] = useState(defaultCoachConfig.baseUrl);
  const [model, setModel] = useState(defaultCoachConfig.model);
  const [timeout, setTimeoutValue] = useState(String(defaultCoachConfig.timeoutSeconds));
  const [token, setToken] = useState('');
  const [hasToken, setHasToken] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    loadCoachConfig().then(({ config, apiKey }) => {
      setBaseUrl(config.baseUrl);
      setModel(config.model);
      setTimeoutValue(String(config.timeoutSeconds));
      setHasToken(Boolean(apiKey));
    }).catch(() => undefined);
  }, []);

  async function save() {
    setBusy(true);
    try {
      const newToken = token.trim() || undefined;
      if (!hasToken && !newToken) throw new Error('Enter the STASIS_API_TOKEN from the Linux server.');
      await saveCoachConfig({
        baseUrl: baseUrl.trim(),
        model: model.trim(),
        allowPrivateHttp: false,
        timeoutSeconds: Number(timeout) || defaultCoachConfig.timeoutSeconds,
      }, newToken);
      if (newToken) {
        setHasToken(true);
        setToken('');
      }
      Alert.alert('Saved', 'Coach server settings are stored on this device.');
    } catch (caught) {
      Alert.alert('Could not save', caught instanceof Error ? caught.message : 'Check the server settings.');
    } finally {
      setBusy(false);
    }
  }

  async function testServer() {
    setBusy(true);
    try {
      await checkCoachHealth(baseUrl.trim());
      Alert.alert('Server reachable', 'Your Stasis backend responded to the health check.');
    } catch (caught) {
      Alert.alert('Server unavailable', caught instanceof Error ? caught.message : 'The health check failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <Screen keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <IconButton accessibilityLabel="Close settings" icon="close" onPress={() => router.back()} />
            <View style={styles.title}>
              <Text style={styles.kicker}>PRIVATE CONNECTION</Text>
              <Text style={styles.heading}>Coach server</Text>
            </View>
          </View>
          <Card style={styles.form}>
            <Field label="BASE URL" value={baseUrl} onChangeText={setBaseUrl} autoCapitalize="none" autoCorrect={false} />
            <Field label="MODEL" value={model} onChangeText={setModel} autoCapitalize="none" autoCorrect={false} />
            <Field
              label="API TOKEN"
              value={token}
              onChangeText={setToken}
              placeholder={hasToken ? 'Saved securely — enter only to replace' : 'Paste STASIS_API_TOKEN'}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Field label="TIMEOUT (SECONDS)" value={timeout} onChangeText={setTimeoutValue} keyboardType="number-pad" />
          </Card>
          <Card>
            <Eyebrow>PRIVACY</Eyebrow>
            <Text style={styles.note}>The API token is kept in iOS SecureStore and is never placed in the app database. Requests travel through your private Tailscale network.</Text>
            <Text style={styles.warning}>Coach currently receives your typed messages only. Health metrics and sensor history are not attached yet.</Text>
          </Card>
          <GlassButton disabled={busy} icon="checkmark" onPress={save} primary>Save settings</GlassButton>
          <GlassButton disabled={busy} icon="pulse-outline" onPress={testServer}>Test server connection</GlassButton>
        </Screen>
    </KeyboardAvoidingView>
  );
}

type FieldProps = ComponentProps<typeof TextInput> & { label: string };

function Field({ label, ...props }: FieldProps) {
  return (
    <View style={styles.field}>
      <Eyebrow>{label}</Eyebrow>
      <TextInput placeholderTextColor={colors.textMuted} style={styles.input} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  title: { flex: 1 },
  kicker: { color: colors.cyan, fontSize: 10, fontWeight: '800', letterSpacing: 1.1 },
  heading: { color: colors.text, fontSize: 28, fontWeight: '800', letterSpacing: -0.7, marginTop: 2 },
  form: { gap: spacing.md },
  field: { gap: spacing.xs },
  input: { backgroundColor: colors.controlFill, borderColor: colors.border, borderCurve: 'continuous', borderRadius: radius.sm, borderWidth: 1, color: colors.text, fontSize: 15, paddingHorizontal: spacing.md, paddingVertical: 13 },
  note: { color: colors.textMuted, fontSize: 13, lineHeight: 20, marginTop: spacing.sm },
  warning: { color: colors.amber, fontSize: 12, lineHeight: 18, marginTop: spacing.sm },
});
