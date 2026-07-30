import { DEFAULT_SITE_URL, PUBLIC_ENV_ALLOWLIST, normalizeSiteUrl } from '@/utils/publicEnv';

describe('PUBLIC_ENV_ALLOWLIST', () => {
  it('lists exactly the public variables the build is wired for', () => {
    expect([...PUBLIC_ENV_ALLOWLIST]).toEqual(['NEXT_PUBLIC_SITE_URL']);
  });

  it('only ever contains NEXT_PUBLIC_-prefixed names', () => {
    PUBLIC_ENV_ALLOWLIST.forEach((name) => expect(name.startsWith('NEXT_PUBLIC_')).toBe(true));
  });
});

describe('normalizeSiteUrl', () => {
  it('defaults to jussaw.com when unset or empty', () => {
    expect(normalizeSiteUrl(undefined)).toBe(DEFAULT_SITE_URL);
    expect(normalizeSiteUrl('')).toBe(DEFAULT_SITE_URL);
    expect(DEFAULT_SITE_URL).toBe('https://jussaw.com');
  });

  it('accepts an https origin and strips a trailing slash', () => {
    expect(normalizeSiteUrl('https://staging.jussaw.com')).toBe('https://staging.jussaw.com');
    expect(normalizeSiteUrl('https://staging.jussaw.com/')).toBe('https://staging.jussaw.com');
    expect(normalizeSiteUrl('  https://jussaw.com/  ')).toBe('https://jussaw.com');
    expect(normalizeSiteUrl('https://jussaw.com:8443')).toBe('https://jussaw.com:8443');
  });

  it('accepts http only on loopback hosts, for local and preview builds', () => {
    expect(normalizeSiteUrl('http://localhost:3000')).toBe('http://localhost:3000');
    expect(normalizeSiteUrl('http://127.0.0.1:3000')).toBe('http://127.0.0.1:3000');
    expect(normalizeSiteUrl('http://jussaw.com')).toBe(DEFAULT_SITE_URL);
    expect(normalizeSiteUrl('http://localhost.evil.example')).toBe(DEFAULT_SITE_URL);
  });

  it('accepts the IPv6 loopback literal, with or without a port', () => {
    expect(normalizeSiteUrl('http://[::1]:3000')).toBe('http://[::1]:3000');
    expect(normalizeSiteUrl('http://[::1]')).toBe('http://[::1]');
    // Non-canonical spellings normalize to `[::1]` before the allowlist check.
    expect(normalizeSiteUrl('http://[0:0:0:0:0:0:0:1]:3000')).toBe('http://[::1]:3000');
    // A non-loopback IPv6 host still requires https.
    expect(normalizeSiteUrl('http://[2606:4700:4700::1111]')).toBe(DEFAULT_SITE_URL);
  });

  it('rejects non-http(s) schemes rather than emitting them into metadata', () => {
    // eslint-disable-next-line no-script-url -- the point of the test is that this is rejected
    expect(normalizeSiteUrl('javascript:alert(1)')).toBe(DEFAULT_SITE_URL);
    expect(normalizeSiteUrl('data:text/html,<script>alert(1)</script>')).toBe(DEFAULT_SITE_URL);
    expect(normalizeSiteUrl('file:///etc/hostname')).toBe(DEFAULT_SITE_URL);
  });

  it('rejects embedded credentials, paths, queries and fragments', () => {
    expect(normalizeSiteUrl('https://user:pass@jussaw.com')).toBe(DEFAULT_SITE_URL);
    expect(normalizeSiteUrl('https://jussaw.com/some/path')).toBe(DEFAULT_SITE_URL);
    expect(normalizeSiteUrl('https://jussaw.com/?utm=x')).toBe(DEFAULT_SITE_URL);
    expect(normalizeSiteUrl('https://jussaw.com/#frag')).toBe(DEFAULT_SITE_URL);
  });

  it('rejects malformed values', () => {
    expect(normalizeSiteUrl('not a url')).toBe(DEFAULT_SITE_URL);
    expect(normalizeSiteUrl('jussaw.com')).toBe(DEFAULT_SITE_URL);
    expect(normalizeSiteUrl('//jussaw.com')).toBe(DEFAULT_SITE_URL);
  });
});
