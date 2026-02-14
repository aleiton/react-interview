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

interface TodoListDetailProps {
  listId: number | null;
}

export function TodoListDetail({ listId }: TodoListDetailProps) {
  const { data: items = [], isLoading } = useGetTodoItemsQuery(listId ?? 0, { skip: listId === null });
  const showSkeleton = useDelayedLoading(isLoading);
  const [updateItem] = useUpdateTodoItemMutation();
  const [deleteItem] = useDeleteTodoItemMutation();
  const [completeAll] = useCompleteAllItemsMutation();
  const { status, resetStatus } = useTodoListChannel(listId);

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
        <h2 className={styles.title}>Items</h2>
        {incompleteCount > 0 && status.state !== 'running' && (
          <button className={styles.completeAllButton} onClick={handleCompleteAll}>
            Mark All Complete ({incompleteCount})
          </button>
        )}
      </div>

      <BulkCompleteStatus status={status} onReset={resetStatus} onRetry={handleCompleteAll} />

      <AddItemForm listId={listId} />

      {showSkeleton && <Skeleton lines={5} />}

      <div className={styles.itemList}>
        {items.map((item) => (
          <TodoItem
            key={item.id}
            item={item}
            onToggle={() =>
              updateItem({ listId, itemId: item.id, updates: { completed: !item.completed } })
            }
            onDelete={() => deleteItem({ listId, itemId: item.id })}
            onEdit={(description) =>
              updateItem({ listId, itemId: item.id, updates: { description } })
            }
          />
        ))}
        {!isLoading && items.length === 0 && (
          <p className={styles.emptyItems}>No items yet. Add one above.</p>
        )}
      </div>
    </main>
  );
}
