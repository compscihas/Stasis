export const HISTORY_END_TOKEN_BYTES = 8;

export function copyValidHistoryEndToken(token: Uint8Array) {
  if (token.byteLength !== HISTORY_END_TOKEN_BYTES) {
    throw new Error(`HISTORY_END token must be exactly ${HISTORY_END_TOKEN_BYTES} bytes.`);
  }

  return new Uint8Array(token);
}
