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

  it('returns null when at root path with no slug', () => {
    const { result } = renderHook(() => useSelectedListId(mockLists));

    expect(result.current.selectedId).toBeNull();
  });

  it('resolves list ID from URL slug', () => {
    history.replaceState(null, '', '/grocery-shopping');
    const { result } = renderHook(() => useSelectedListId(mockLists));

    expect(result.current.selectedId).toBe(1);
  });

  it('returns null for unrecognized slugs', () => {
    history.replaceState(null, '', '/nonexistent-list');
    const { result } = renderHook(() => useSelectedListId(mockLists));

    expect(result.current.selectedId).toBeNull();
  });

  it('updates the URL slug when selecting a list', () => {
    const { result } = renderHook(() => useSelectedListId(mockLists));

    act(() => {
      result.current.select(7);
    });

    expect(result.current.selectedId).toBe(7);
    expect(window.location.pathname).toBe('/work-tasks');
  });

  it('resets URL to / when deselecting', () => {
    history.replaceState(null, '', '/grocery-shopping');
    const { result } = renderHook(() => useSelectedListId(mockLists));

    act(() => {
      result.current.select(null);
    });

    expect(result.current.selectedId).toBeNull();
    expect(window.location.pathname).toBe('/');
  });
});
