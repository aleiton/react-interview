import { useRef, useState, useEffect, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  useGetTodoItemsQuery,
  useUpdateTodoItemMutation,
  useDeleteTodoItemMutation,
  useCompleteAllItemsMutation,
} from '../api/todoApi';
import { useTodoListChannel } from '../cable/useTodoListChannel';
import { TodoItem } from './TodoItem';
import { AddItemForm } from './AddItemForm';
import { BulkCompleteStatus } from './BulkCompleteStatus';
import { Skeleton } from './Skeleton';
import { useDelayedLoading } from '../hooks/useDelayedLoading';
import styles from './TodoListDetail.module.css';

const ESTIMATED_ITEM_HEIGHT = 41;
const SCROLL_THRESHOLD = 5;

interface TodoListDetailProps {
  listId: number | null;
}

export function TodoListDetail({ listId }: TodoListDetailProps) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [listId]);

  const resetPage = useCallback(() => setPage(1), []);

  const { data, isLoading, isFetching } = useGetTodoItemsQuery(
    { listId: listId ?? 0, page },
    { skip: listId === null },
  );

  const items = data?.items ?? [];
  const hasNextPage = data?.meta ? data.meta.page < data.meta.totalPages : false;

  const showSkeleton = useDelayedLoading(isLoading);
  const [updateItem] = useUpdateTodoItemMutation();
  const [deleteItem] = useDeleteTodoItemMutation();
  const [completeAll] = useCompleteAllItemsMutation();
  const { status, resetStatus } = useTodoListChannel(listId, resetPage);
  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ESTIMATED_ITEM_HEIGHT,
    overscan: 10,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    if (virtualItems.length === 0) return;

    const lastItem = virtualItems[virtualItems.length - 1];
    if (
      lastItem &&
      lastItem.index >= items.length - SCROLL_THRESHOLD &&
      hasNextPage &&
      !isFetching
    ) {
      setPage((prev) => prev + 1);
    }
  }, [virtualItems, items.length, hasNextPage, isFetching]);

  if (listId === null) {
    return (
      <main className={styles.container}>
        <p className={styles.emptyState}>Select a list to view its items</p>
      </main>
    );
  }

  const handleCompleteAll = async () => {
    resetStatus();
    await completeAll(listId);
  };

  const incompleteCount = items.filter((i) => !i.completed).length;

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Items
          {data?.meta && <span className={styles.itemCount}> ({data.meta.totalCount})</span>}
        </h2>
        {incompleteCount > 0 && status.state !== 'running' && (
          <button className={styles.completeAllButton} onClick={handleCompleteAll}>
            Mark All Complete ({incompleteCount})
          </button>
        )}
      </div>

      <BulkCompleteStatus status={status} onReset={resetStatus} onRetry={handleCompleteAll} />

      <AddItemForm listId={listId} onItemCreated={resetPage} />

      {showSkeleton && <Skeleton lines={5} />}

      {!isLoading && items.length === 0 ? (
        <div className={styles.itemList}>
          <p className={styles.emptyItems}>No items yet. Add one above.</p>
        </div>
      ) : (
        <div ref={scrollRef} className={styles.itemList} style={{ overflowY: 'auto', maxHeight: '60vh' }}>
          <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const item = items[virtualRow.index];
              return (
                <div
                  key={item.id}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <TodoItem
                    item={item}
                    onToggle={() =>
                      updateItem({ listId, itemId: item.id, updates: { completed: !item.completed } })
                    }
                    onDelete={() => deleteItem({ listId, itemId: item.id })}
                    onEdit={(description) =>
                      updateItem({ listId, itemId: item.id, updates: { description } })
                    }
                  />
                </div>
              );
            })}
          </div>
          {isFetching && page > 1 && (
            <div className={styles.loadingMore}>Loading more...</div>
          )}
        </div>
      )}
    </main>
  );
}
