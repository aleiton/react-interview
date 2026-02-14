import { useState, useRef, useEffect } from 'react';
import {
  useGetTodoListsQuery,
  useCreateTodoListMutation,
  useUpdateTodoListMutation,
  useDeleteTodoListMutation,
} from '../api/todoApi';
import { Skeleton } from './Skeleton';
import { useDelayedLoading } from '../hooks/useDelayedLoading';
import styles from './TodoListSidebar.module.css';

interface TodoListSidebarProps {
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

export function TodoListSidebar({ selectedId, onSelect }: TodoListSidebarProps) {
  const { data: lists = [], isLoading } = useGetTodoListsQuery();
  const showSkeleton = useDelayedLoading(isLoading);
  const [createList] = useCreateTodoListMutation();
  const [updateList] = useUpdateTodoListMutation();
  const [deleteList] = useDeleteTodoListMutation();
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId !== null) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [editingId]);

  const handleCreate = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    await createList(trimmed);
    setNewName('');
  };

  const handleDelete = async (id: number) => {
    await deleteList(id);
    if (selectedId === id) onSelect(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreate();
  };

  const startEditing = (id: number, name: string) => {
    setEditingId(id);
    setEditValue(name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValue('');
  };

  const saveEditing = async () => {
    const trimmed = editValue.trim();
    if (!trimmed || editingId === null) {
      cancelEditing();
      return;
    }
    await updateList({ id: editingId, name: trimmed });
    cancelEditing();
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEditing();
    if (e.key === 'Escape') cancelEditing();
  };

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Todo Lists</h2>

      <div className={styles.createForm}>
        <input
          className={styles.input}
          type="text"
          placeholder="New list name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className={styles.createButton} onClick={handleCreate}>
          Add
        </button>
      </div>

      {showSkeleton && <Skeleton lines={4} dark />}

      <ul className={styles.list}>
        {lists.map((list) => (
          <li
            key={list.id}
            className={`${styles.item} ${selectedId === list.id ? styles.active : ''}`}
            onClick={() => onSelect(list.id)}
          >
            {editingId === list.id ? (
              <input
                ref={editInputRef}
                className={styles.editInput}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleEditKeyDown}
                onBlur={saveEditing}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span
                className={styles.name}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  startEditing(list.id, list.name);
                }}
              >
                {list.name}
              </span>
            )}
            <button
              className={styles.deleteButton}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(list.id);
              }}
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
