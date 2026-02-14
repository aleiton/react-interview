import styles from './TodoItem.module.css';
import { useInlineEdit } from '../hooks/useInlineEdit';
import type { TodoItem as TodoItemType } from '../types/api';

interface TodoItemProps {
  item: TodoItemType;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (description: string) => void;
}

export function TodoItem({ item, onToggle, onDelete, onEdit }: TodoItemProps) {
  const {
    editing, editValue, setEditValue, inputRef,
    startEditing, saveEditing, handleKeyDown,
  } = useInlineEdit({ onSave: onEdit, disabled: item.completed });

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
            ref={inputRef}
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
            onDoubleClick={() => startEditing(item.description)}
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
