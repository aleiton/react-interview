import styles from './TodoItem.module.css';
import type { TodoItem as TodoItemType } from '../types/api';

interface TodoItemProps {
  item: TodoItemType;
  onToggle: () => void;
  onDelete: () => void;
}

export function TodoItem({ item, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>
        <input
          type="checkbox"
          checked={item.completed}
          onChange={onToggle}
          className={styles.checkbox}
        />
        <span className={item.completed ? styles.completed : styles.description}>
          {item.description}
        </span>
      </label>
      <button className={styles.deleteButton} onClick={onDelete}>
        &times;
      </button>
    </div>
  );
}
