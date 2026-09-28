import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBackdrop } from '@/components/screen';
import { Card, GlassSurface, IconButton, TactilePressable } from '@/components/ui';
import { colors, radius, spacing } from '@/design/tokens';
import { type CoachMessage, sendCoachMessage } from '@/services/coach-client';

export default function CoachScreen() {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const scroll = useRef<ScrollView>(null);

  async function send() {
    const content = draft.trim();
    if (!content || sending) return;
    const next: CoachMessage[] = [...messages, { role: 'user', content }];
    setDraft('');
    setError('');
    setMessages(next);
    setSending(true);
    try {
      const reply = await sendCoachMessage(next);
      setMessages([...next, { role: 'assistant', content: reply }]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Coach could not be reached.');
    } finally {
      setSending(false);
    }
  }

  return (
    <View style={styles.root}>
      <AppBackdrop />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <View style={styles.header}>
          <IconButton accessibilityLabel="Close Coach" icon="close" onPress={() => router.back()} />
          <View style={styles.titleWrap}>
            <Text style={styles.kicker}>PRIVATE WELLNESS ASSISTANT</Text>
            <Text style={styles.title}>Stasis Coach</Text>
          </View>
          <IconButton accessibilityLabel="Coach server settings" icon="settings-outline" onPress={() => router.push('/coach-settings')} />
        </View>
        <ScrollView
          contentContainerStyle={styles.messages}
          onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}
          ref={scroll}
          showsVerticalScrollIndicator={false}
        >
          <Card>
            <Text style={styles.coachText}>Ask Stasis Coach a general wellness question.</Text>
            <Text style={styles.disclosure}>Connected to your self-hosted model. Personal sensor and health-record context is not connected yet.</Text>
          </Card>
          {messages.map((item, index) => (
            <View key={`${item.role}-${index}`} style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
              <Text style={item.role === 'user' ? styles.userMessageText : styles.messageText}>{item.content}</Text>
            </View>
          ))}
          {sending ? <View style={[styles.bubble, styles.assistantBubble]}><ActivityIndicator color={colors.peach} /></View> : null}
          {error ? (
            <TactilePressable onPress={() => router.push('/coach-settings')} style={styles.errorCard}>
              <Text style={styles.errorText}>{error}</Text>
              <Text style={styles.errorLink}>Open Coach server settings</Text>
            </TactilePressable>
          ) : null}
        </ScrollView>
        <GlassSurface interactive style={styles.composer}>
          <TextInput
            multiline
            onChangeText={setDraft}
            placeholder="Ask about sleep, recovery, or training…"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            value={draft}
          />
          <TactilePressable disabled={!draft.trim() || sending} haptic="light" onPress={send} style={[styles.send, (!draft.trim() || sending) && styles.sendDisabled]}>
            <Ionicons color="#FFFFFF" name="arrow-up" size={20} />
          </TactilePressable>
        </GlassSurface>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: colors.background, flex: 1, overflow: 'hidden' },
  safe: { flex: 1 },
  container: { flex: 1, paddingHorizontal: spacing.md },
  header: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, paddingTop: spacing.sm },
  titleWrap: { flex: 1, minWidth: 0 },
  kicker: { color: colors.textMuted, fontSize: 11, fontWeight: '600', letterSpacing: 0.6 },
  title: { color: colors.text, fontSize: 28, fontWeight: '700', letterSpacing: 0.36, marginTop: 2 },
  messages: { flexGrow: 1, gap: spacing.md, justifyContent: 'flex-end', paddingBottom: spacing.lg, paddingTop: spacing.md },
  coachText: { color: colors.text, fontSize: 17, lineHeight: 25 },
  disclosure: { color: colors.amber, fontSize: 12, lineHeight: 18, marginTop: spacing.md },
  bubble: { borderRadius: radius.md, maxWidth: '88%', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  assistantBubble: { alignSelf: 'flex-start', backgroundColor: colors.glassStrong, borderColor: colors.border, borderWidth: 1 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: colors.blue },
  messageText: { color: colors.text, fontSize: 17, lineHeight: 22 },
  userMessageText: { color: '#FFFFFF', fontSize: 17, lineHeight: 22 },
  errorCard: { alignSelf: 'stretch', backgroundColor: colors.dangerFill, borderColor: colors.danger, borderRadius: radius.sm, borderWidth: 1, padding: spacing.md },
  errorText: { color: colors.text, fontSize: 13, lineHeight: 19 },
  errorLink: { color: colors.peach, fontSize: 12, fontWeight: '800', marginTop: spacing.xs },
  composer: { alignItems: 'flex-end', borderRadius: 28, flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm, overflow: 'hidden', padding: spacing.sm },
  input: { color: colors.text, flex: 1, fontSize: 16, maxHeight: 120, minHeight: 42, paddingHorizontal: spacing.sm, paddingTop: 10 },
  send: { alignItems: 'center', backgroundColor: colors.blue, borderRadius: radius.pill, height: 42, justifyContent: 'center', width: 42 },
  sendDisabled: { opacity: 0.35 },
});
