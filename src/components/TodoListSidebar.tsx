import { useState } from 'react';
import {
  useGetTodoListsQuery,
  useCreateTodoListMutation,
  useDeleteTodoListMutation,
} from '../api/todoApi';
import styles from './TodoListSidebar.module.css';

interface TodoListSidebarProps {
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

export function TodoListSidebar({ selectedId, onSelect }: TodoListSidebarProps) {
  const { data: lists = [], isLoading } = useGetTodoListsQuery();
  const [createList] = useCreateTodoListMutation();
  const [deleteList] = useDeleteTodoListMutation();
  const [newName, setNewName] = useState('');

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

      {isLoading && <p className={styles.loading}>Loading...</p>}

      <ul className={styles.list}>
        {lists.map((list) => (
          <li
            key={list.id}
            className={`${styles.item} ${selectedId === list.id ? styles.active : ''}`}
            onClick={() => onSelect(list.id)}
          >
            <span className={styles.name}>{list.name}</span>
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
