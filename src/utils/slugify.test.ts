import { describe, it, expect } from 'vitest';
import { slugify } from './slugify';

describe('slugify', () => {
  it('converts to lowercase with hyphens', () => {
    expect(slugify('Grocery Shopping')).toBe('grocery-shopping');
  });

  it('replaces multiple special characters with a single hyphen', () => {
    expect(slugify('Work & Life --- Balance!')).toBe('work-life-balance');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify('  Hello World  ')).toBe('hello-world');
  });

  it('handles empty string', () => {
    expect(slugify('')).toBe('');
  });
});
