import { useState } from 'react';
import {
  useGetTodoListsQuery,
  useCreateTodoListMutation,
  useUpdateTodoListMutation,
  useDeleteTodoListMutation,
} from '../api/todoApi';
import { Skeleton } from './Skeleton';
import { useDelayedLoading } from '../hooks/useDelayedLoading';
import { useInlineEdit } from '../hooks/useInlineEdit';
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

  const edit = useInlineEdit({
    onSave: (value) => {
      if (editingId !== null) {
        updateList({ id: editingId, name: value });
      }
      setEditingId(null);
    },
  });

  const handleCreate = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const result = await createList(trimmed);
    if (!('error' in result)) setNewName('');
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this list and all its items?')) return;
    await deleteList(id);
    if (selectedId === id) onSelect(null);
  };

  const handleCreateKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreate();
  };

  const startEditing = (id: number, name: string) => {
    setEditingId(id);
    edit.startEditing(name);
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
          onKeyDown={handleCreateKeyDown}
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
            {editingId === list.id && edit.editing ? (
              <input
                ref={edit.inputRef}
                className={styles.editInput}
                type="text"
                value={edit.editValue}
                onChange={(e) => edit.setEditValue(e.target.value)}
                onKeyDown={edit.handleKeyDown}
                onBlur={() => { edit.saveEditing(); setEditingId(null); }}
                onClick={(e) => e.stopPropagation()}
                aria-label="Edit list name"
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
              aria-label="Delete list"
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
