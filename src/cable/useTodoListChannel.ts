import { useEffect, useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import consumer from './consumer';
import { todoApi } from '../api/todoApi';
import type { TodoListBroadcast } from '../types/cable';
import type { Subscription } from '@rails/actioncable';

export type BulkCompleteStatus =
  | { state: 'idle' }
  | { state: 'running'; completed: number; total: number }
  | { state: 'done'; completed: number; total: number }
  | { state: 'error' };

export function useTodoListChannel(listId: number | null, onInvalidate?: () => void) {
  const [status, setStatus] = useState<BulkCompleteStatus>({ state: 'idle' });
  const dispatch = useDispatch();
  const onInvalidateRef = useRef(onInvalidate);
  onInvalidateRef.current = onInvalidate;

  useEffect(() => {
    if (listId === null) return;

    setStatus({ state: 'idle' });

    const subscription: Subscription = consumer.subscriptions.create(
      { channel: 'TodoListChannel', id: listId },
      {
        received(data: TodoListBroadcast) {
          switch (data.action) {
            case 'progress':
              setStatus({
                state: 'running',
                completed: data.completed,
                total: data.total,
              });
              if (data.completed_ids?.length > 0) {
                const completedSet = new Set(data.completed_ids);
                dispatch(
                  todoApi.util.updateQueryData('getTodoItems', { listId, page: 1 }, (draft) => {
                    for (const item of draft.items) {
                      if (completedSet.has(item.id)) {
                        item.completed = true;
                      }
                    }
                  }),
                );
              }
              break;
            case 'completed':
              setStatus({
                state: 'done',
                completed: data.completed,
                total: data.total,
              });
              dispatch(
                todoApi.util.invalidateTags([{ type: 'TodoItem', id: `LIST-${listId}` }])
              );
              onInvalidateRef.current?.();
              break;
            case 'error':
              setStatus({ state: 'error' });
              break;
          }
        },
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [listId, dispatch]);

  const resetStatus = useCallback(() => {
    setStatus({ state: 'idle' });
  }, []);

  return { status, resetStatus };
}
