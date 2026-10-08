import { copyValidHistoryEndToken } from './history-policy';

describe('copyValidHistoryEndToken', () => {
  it('accepts and copies the exact eight-byte token', () => {
    const token = Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]);
    const result = copyValidHistoryEndToken(token);

    expect(result).toEqual(token);
    expect(result).not.toBe(token);
  });

  it.each([0, 7, 9])('rejects a %i-byte token', (length) => {
    expect(() => copyValidHistoryEndToken(new Uint8Array(length))).toThrow(
      'HISTORY_END token must be exactly 8 bytes.',
    );
  });
});
