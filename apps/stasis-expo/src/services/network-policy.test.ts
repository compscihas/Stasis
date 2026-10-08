import { validateServiceUrl } from './network-policy';

describe('validateServiceUrl', () => {
  it('accepts HTTPS endpoints', () => {
    expect(validateServiceUrl('https://llm.example.com/v1', false)).toBeNull();
  });

  it('accepts private HTTP only after explicit permission', () => {
    expect(validateServiceUrl('http://192.168.1.50:8000/v1', false)).toMatch(/permission/);
    expect(validateServiceUrl('http://192.168.1.50:8000/v1', true)).toBeNull();
  });

  it('rejects public plaintext endpoints', () => {
    expect(validateServiceUrl('http://example.com/v1', true)).toMatch(/private-network/);
  });
});
