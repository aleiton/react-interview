import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useSelectedListId } from './useSelectedListId';

const mockLists = [
  { id: 1, name: 'Grocery Shopping' },
  { id: 7, name: 'Work Tasks' },
  { id: 42, name: 'Weekend Chores' },
];

describe('useSelectedListId', () => {
  beforeEach(() => {
    history.replaceState(null, '', '/');
  });

  it('returns null when at root path with no ID', () => {
    const { result } = renderHook(() => useSelectedListId(mockLists));

    expect(result.current.selectedId).toBeNull();
  });

  it('resolves list ID from URL', () => {
    history.replaceState(null, '', '/1');
    const { result } = renderHook(() => useSelectedListId(mockLists));

    expect(result.current.selectedId).toBe(1);
  });

  it('returns null for unrecognized IDs', () => {
    history.replaceState(null, '', '/999');
    const { result } = renderHook(() => useSelectedListId(mockLists));

    expect(result.current.selectedId).toBeNull();
  });

  it('updates the URL when selecting a list', () => {
    const { result } = renderHook(() => useSelectedListId(mockLists));

    act(() => {
      result.current.select(7);
    });

    expect(result.current.selectedId).toBe(7);
    expect(window.location.pathname).toBe('/7');
  });

  it('preserves legacy slug URL for 404 detection', () => {
    history.replaceState(null, '', '/weekend-chores');
    const { result } = renderHook(() => useSelectedListId(mockLists));

    expect(result.current.selectedId).toBeNull();
    expect(window.location.pathname).toBe('/weekend-chores');
  });

  it('resets URL to / when deselecting', () => {
    history.replaceState(null, '', '/1');
    const { result } = renderHook(() => useSelectedListId(mockLists));

    act(() => {
      result.current.select(null);
    });

    expect(result.current.selectedId).toBeNull();
    expect(window.location.pathname).toBe('/');
  });
});
