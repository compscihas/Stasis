import { loadCoachConfig } from '@/services/coach-config';
import { validateServiceUrl } from '@/services/network-policy';

export type CoachMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type CompletionResponse = {
  choices?: Array<{ message?: { content?: string } }>;
  detail?: string;
};

const systemMessage = `You are Stasis Coach, a concise wellness assistant. Give practical, cautious guidance and never diagnose or replace a clinician. No personal sensor or health-record context is available in this request; say so when a question requires it.`;

export function healthUrlForBase(baseUrl: string) {
  const url = new URL(baseUrl);
  url.pathname = '/health';
  url.search = '';
  url.hash = '';
  return url.toString();
}

export function parseCoachResponse(payload: CompletionResponse) {
  const content = payload.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('The Coach server returned an empty response.');
  return content;
}

function requestTimeout(seconds: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), seconds * 1000);
  return { controller, clear: () => clearTimeout(timeout) };
}

export async function sendCoachMessage(messages: CoachMessage[]) {
  const { config, apiKey } = await loadCoachConfig();
  const policyError = validateServiceUrl(config.baseUrl, config.allowPrivateHttp);
  if (policyError) throw new Error(policyError);
  if (!apiKey) throw new Error('Add your Stasis API token in Coach server settings first.');

  const timer = requestTimeout(config.timeoutSeconds);
  try {
    const response = await fetch(`${config.baseUrl.replace(/\/+$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: systemMessage },
          ...messages.slice(-10),
        ],
        max_tokens: 300,
        temperature: 0.2,
      }),
      signal: timer.controller.signal,
    });
    const payload = (await response.json().catch(() => ({}))) as CompletionResponse;
    if (!response.ok) throw new Error(payload.detail || `Coach request failed (${response.status}).`);
    return parseCoachResponse(payload);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Coach did not respond within ${config.timeoutSeconds} seconds.`);
    }
    throw error;
  } finally {
    timer.clear();
  }
}

export async function checkCoachHealth(baseUrl: string, timeoutSeconds = 15) {
  const timer = requestTimeout(timeoutSeconds);
  try {
    const response = await fetch(healthUrlForBase(baseUrl), { signal: timer.controller.signal });
    if (!response.ok) throw new Error(`Server health check failed (${response.status}).`);
    return response.json() as Promise<Record<string, unknown>>;
  } finally {
    timer.clear();
  }
}
