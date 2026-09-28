const privateV4 = /^(10\.|127\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/;

export function validateServiceUrl(value: string, allowPrivateHttp: boolean) {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return 'Enter a valid absolute URL.';
  }

  if (url.protocol === 'https:') return null;
  if (url.protocol !== 'http:') return 'Only HTTP and HTTPS are supported.';
  if (!allowPrivateHttp) return 'Local HTTP requires explicit permission.';

  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (host === 'localhost' || host === '::1' || privateV4.test(host)) return null;
  return 'Plain HTTP is restricted to loopback or private-network hosts.';
}
