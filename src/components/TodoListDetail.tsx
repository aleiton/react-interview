import { useState } from 'react';
import {
  useGetTodoItemsQuery,
  useCreateTodoItemMutation,
  useUpdateTodoItemMutation,
  useDeleteTodoItemMutation,
  useCompleteAllItemsMutation,
} from '../api/todoApi';
import { useTodoListChannel } from '../cable/useTodoListChannel';
import { TodoItem } from './TodoItem';
import { ProgressBar } from './ProgressBar';
import { ErrorBanner } from './ErrorBanner';
import styles from './TodoListDetail.module.css';

interface TodoListDetailProps {
  listId: number | null;
}

export function TodoListDetail({ listId }: TodoListDetailProps) {
  const { data: items = [], isLoading } = useGetTodoItemsQuery(listId!, { skip: listId === null });
  const [createItem] = useCreateTodoItemMutation();
  const [updateItem] = useUpdateTodoItemMutation();
  const [deleteItem] = useDeleteTodoItemMutation();
  const [completeAll] = useCompleteAllItemsMutation();
  const { status, resetStatus } = useTodoListChannel(listId);
  const [newDescription, setNewDescription] = useState('');

  if (listId === null) {
    return (
      <main className={styles.container}>
        <p className={styles.emptyState}>Select a list to view its items</p>
      </main>
    );
  }

  const handleAddItem = async () => {
    const trimmed = newDescription.trim();
    if (!trimmed) return;
    await createItem({ listId, description: trimmed });
    setNewDescription('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddItem();
  };

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

      {status.state === 'running' && (
        <ProgressBar completed={status.completed} total={status.total} />
      )}

      {status.state === 'done' && (
        <div className={styles.successBanner}>
          Completed {status.completed} items
        </div>
      )}

      {status.state === 'error' && (
        <ErrorBanner
          message="Bulk completion failed. Some items may have been completed."
          onRetry={handleCompleteAll}
        />
      )}

      <div className={styles.addForm}>
        <input
          className={styles.input}
          type="text"
          placeholder="Add a new item..."
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className={styles.addButton} onClick={handleAddItem}>
          Add
        </button>
      </div>

      {isLoading && <p className={styles.loading}>Loading items...</p>}

      <div className={styles.itemList}>
        {items.map((item) => (
          <TodoItem
            key={item.id}
            item={item}
            onToggle={() =>
              updateItem({ listId, itemId: item.id, updates: { completed: !item.completed } })
            }
            onDelete={() => deleteItem({ listId, itemId: item.id })}
          />
        ))}
        {!isLoading && items.length === 0 && (
          <p className={styles.emptyItems}>No items yet. Add one above.</p>
        )}
      </div>
    </main>
  );
}
