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

  useEffect(() => {
    if (editing) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [editing]);

  const startEditing = () => {
    if (item.completed) return;
    setEditing(true);
    setEditValue(item.description);
  };

  const cancelEditing = () => {
    setEditing(false);
    setEditValue('');
  };

  const saveEditing = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== item.description) {
      onEdit(trimmed);
    }
    cancelEditing();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEditing();
    if (e.key === 'Escape') cancelEditing();
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>
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
          />
        ) : (
          <span
            className={item.completed ? styles.completed : styles.description}
            onDoubleClick={startEditing}
          >
            {item.description}
          </span>
        )}
      </label>
      <button className={styles.deleteButton} onClick={onDelete}>
        &times;
      </button>
    </div>
  );
}
