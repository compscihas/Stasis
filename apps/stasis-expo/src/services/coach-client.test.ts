import { healthUrlForBase, parseCoachResponse } from './coach-client';

describe('Coach client', () => {
  it('derives the backend health endpoint from an OpenAI-compatible base URL', () => {
    expect(healthUrlForBase('https://stasis.example.ts.net/v1')).toBe('https://stasis.example.ts.net/health');
  });

  it('extracts and trims the assistant response', () => {
    expect(parseCoachResponse({ choices: [{ message: { content: '  Ready.  ' } }] })).toBe('Ready.');
  });

  it('rejects an empty assistant response', () => {
    expect(() => parseCoachResponse({ choices: [] })).toThrow(/empty response/);
  });
});
