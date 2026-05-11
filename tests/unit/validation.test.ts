import { describe, expect, it } from 'vitest';
import { validatePrompt } from '@/lib/validation';

describe('validatePrompt', () => {
  it('rejects empty prompts', () => {
    expect(validatePrompt('   ')).toBe('Enter a prompt before sending.');
  });

  it('accepts non-empty prompts', () => {
    expect(validatePrompt('Explain failover')).toBeNull();
  });
});
