import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SubscriptionCallbacks } from '@rails/actioncable';
import type { TodoListBroadcast } from '../types/cable';

const mockUnsubscribe = vi.fn();
const mockDispatch = vi.fn();
let receivedCallback: ((data: TodoListBroadcast) => void) | undefined;

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

vi.mock('./consumer', () => ({
  default: {
    subscriptions: {
      create: (_channel: unknown, callbacks: SubscriptionCallbacks<TodoListBroadcast>) => {
        receivedCallback = callbacks.received as (data: TodoListBroadcast) => void;
        return { unsubscribe: mockUnsubscribe };
      },
    },
  },
}));

vi.mock('../api/todoApi', () => ({
  todoApi: {
    util: {
      invalidateTags: (tags: unknown) => ({ type: 'invalidateTags', payload: tags }),
    },
  },
}));

import { useTodoListChannel } from './useTodoListChannel';

describe('useTodoListChannel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    receivedCallback = undefined;
  });

  it('starts idle and does not subscribe when listId is null', () => {
    const { result } = renderHook(() => useTodoListChannel(null));

    expect(result.current.status).toEqual({ state: 'idle' });
    expect(receivedCallback).toBeUndefined();
  });

  it('subscribes when listId is provided and unsubscribes on unmount', () => {
    const { unmount } = renderHook(() => useTodoListChannel(1));

    expect(receivedCallback).toBeDefined();
    expect(mockUnsubscribe).not.toHaveBeenCalled();

    unmount();
    expect(mockUnsubscribe).toHaveBeenCalledOnce();
  });

  it('transitions from idle to running on progress broadcast', () => {
    const { result } = renderHook(() => useTodoListChannel(1));

    act(() => {
      receivedCallback!({ action: 'progress', completed: 5, total: 10 });
    });

    expect(result.current.status).toEqual({
      state: 'running',
      completed: 5,
      total: 10,
    });
  });

  it('transitions to done on completed broadcast and dispatches cache invalidation', () => {
    const { result } = renderHook(() => useTodoListChannel(1));

    act(() => {
      receivedCallback!({ action: 'completed', completed: 10, total: 10 });
    });

    expect(result.current.status).toEqual({
      state: 'done',
      completed: 10,
      total: 10,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'invalidateTags',
      payload: [{ type: 'TodoItem', id: 'LIST-1' }],
    });
  });

  it('transitions to error on error broadcast', () => {
    const { result } = renderHook(() => useTodoListChannel(1));

    act(() => {
      receivedCallback!({ action: 'error' });
    });

    expect(result.current.status).toEqual({ state: 'error' });
  });

  it('resets status to idle via resetStatus', () => {
    const { result } = renderHook(() => useTodoListChannel(1));

    act(() => {
      receivedCallback!({ action: 'error' });
    });
    expect(result.current.status.state).toBe('error');

    act(() => {
      result.current.resetStatus();
    });
    expect(result.current.status).toEqual({ state: 'idle' });
  });
});
