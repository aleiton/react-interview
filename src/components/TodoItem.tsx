import { useState, useRef, useEffect } from 'react';
import styles from './TodoItem.module.css';
import type { TodoItem as TodoItemType } from '../types/api';

interface TodoItemProps {
  item: TodoItemType;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (description: string) => void;
}

export function TodoItem({ item, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    if (editing) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [editing]);

  const startEditing = () => {
    if (item.completed) return;
    savingRef.current = false;
    setEditing(true);
    setEditValue(item.description);
  };

  const cancelEditing = () => {
    savingRef.current = true;
    setEditing(false);
    setEditValue('');
  };

  const saveEditing = () => {
    if (savingRef.current) return;
    savingRef.current = true;
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== item.description) {
      onEdit(trimmed);
    }
    setEditing(false);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEditing();
    if (e.key === 'Escape') cancelEditing();
  };

  return (
    <div className={styles.container}>
      <div className={styles.label}>
        <input
          type="checkbox"
          checked={item.completed}
          onChange={onToggle}
          className={styles.checkbox}
        />
        {editing ? (
          <input
            ref={editInputRef}
            className={styles.editInput}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={saveEditing}
            aria-label="Edit item description"
          />
        ) : (
          <span
            className={item.completed ? styles.completed : styles.description}
            onDoubleClick={startEditing}
          >
            {item.description}
          </span>
        )}
      </div>
      <button className={styles.deleteButton} onClick={onDelete} aria-label="Delete item">
        &times;
      </button>
    </div>
  );
}
