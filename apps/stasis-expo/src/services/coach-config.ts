import * as SecureStore from 'expo-secure-store';

import { getSetting, setSetting } from '@/data/database';
import { validateServiceUrl } from '@/services/network-policy';

const API_KEY = 'stasis.llm.apiKey';
const CONFIG_KEY = 'stasis.llm.config';

export type CoachConfig = {
  baseUrl: string;
  model: string;
  allowPrivateHttp: boolean;
  timeoutSeconds: number;
};

export const defaultCoachConfig: CoachConfig = {
  baseUrl: 'https://hasansai.tail350e78.ts.net/v1',
  model: 'qwen2.5-coder:3b',
  allowPrivateHttp: false,
  timeoutSeconds: 120,
};

export async function saveCoachConfig(config: CoachConfig, apiKey?: string) {
  const error = validateServiceUrl(config.baseUrl, config.allowPrivateHttp);
  if (error) throw new Error(error);
  const normalized = {
    ...config,
    baseUrl: config.baseUrl.replace(/\/+$/, ''),
    timeoutSeconds: Math.max(5, Math.min(120, config.timeoutSeconds)),
  };
  await setSetting(CONFIG_KEY, JSON.stringify(normalized));
  if (apiKey !== undefined) {
    if (apiKey.trim()) await SecureStore.setItemAsync(API_KEY, apiKey.trim());
    else await SecureStore.deleteItemAsync(API_KEY);
  }
}

export async function loadCoachConfig() {
  const [raw, apiKey] = await Promise.all([
    getSetting(CONFIG_KEY),
    SecureStore.getItemAsync(API_KEY),
  ]);
  const config = raw ? ({ ...defaultCoachConfig, ...JSON.parse(raw) } as CoachConfig) : defaultCoachConfig;
  return { config, apiKey: apiKey ?? '' };
}
