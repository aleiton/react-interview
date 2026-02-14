import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useSelectedListId } from './useSelectedListId';

describe('useSelectedListId', () => {
  beforeEach(() => {
    history.replaceState(null, '', '/');
  });

  it('returns null when no list param is in the URL', () => {
    const { result } = renderHook(() => useSelectedListId());
    expect(result.current.selectedId).toBeNull();
  });

  it('reads the initial list ID from the URL search params', () => {
    history.replaceState(null, '', '/?list=42');
    const { result } = renderHook(() => useSelectedListId());
    expect(result.current.selectedId).toBe(42);
  });

  it('ignores invalid list param values', () => {
    history.replaceState(null, '', '/?list=abc');
    const { result } = renderHook(() => useSelectedListId());
    expect(result.current.selectedId).toBeNull();
  });

  it('updates the URL when selecting a list', () => {
    const { result } = renderHook(() => useSelectedListId());

    act(() => {
      result.current.select(7);
    });

    expect(result.current.selectedId).toBe(7);
    expect(new URLSearchParams(window.location.search).get('list')).toBe('7');
  });

  it('removes the list param when deselecting', () => {
    history.replaceState(null, '', '/?list=5');
    const { result } = renderHook(() => useSelectedListId());

    act(() => {
      result.current.select(null);
    });

    expect(result.current.selectedId).toBeNull();
    expect(new URLSearchParams(window.location.search).has('list')).toBe(false);
  });
});
