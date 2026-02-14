import { describe, it, expect } from 'vitest';
import { camelizeKeys } from './camelize';

describe('camelizeKeys', () => {
  it('converts snake_case keys to camelCase', () => {
    const input = { created_at: '2026-01-01', updated_at: '2026-01-02' };
    expect(camelizeKeys(input)).toEqual({ createdAt: '2026-01-01', updatedAt: '2026-01-02' });
  });

  it('handles nested objects', () => {
    const input = { todo_item: { todo_list_id: 1, created_at: '2026-01-01' } };
    expect(camelizeKeys(input)).toEqual({ todoItem: { todoListId: 1, createdAt: '2026-01-01' } });
  });

  it('handles arrays of objects', () => {
    const input = [{ todo_list_id: 1 }, { todo_list_id: 2 }];
    expect(camelizeKeys(input)).toEqual([{ todoListId: 1 }, { todoListId: 2 }]);
  });

  it('leaves camelCase keys unchanged', () => {
    const input = { id: 1, name: 'test' };
    expect(camelizeKeys(input)).toEqual({ id: 1, name: 'test' });
  });

  it('handles primitives', () => {
    expect(camelizeKeys('hello')).toBe('hello');
    expect(camelizeKeys(42)).toBe(42);
    expect(camelizeKeys(null)).toBe(null);
    expect(camelizeKeys(true)).toBe(true);
  });

  it('handles empty structures', () => {
    expect(camelizeKeys({})).toEqual({});
    expect(camelizeKeys([])).toEqual([]);
  });
});
