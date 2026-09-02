import { describe, expect, it } from 'vitest';
import { requireEnv } from './env';

describe('requireEnv', () => {
  it('returns the value when present', () => {
    expect(requireEnv('FOO', 'bar')).toBe('bar');
  });

  it('throws when the value is missing', () => {
    expect(() => requireEnv('FOO', undefined)).toThrow(
      'Missing required environment variable: FOO',
    );
  });
});
