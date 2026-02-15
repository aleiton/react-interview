import { useState, useEffect } from 'react';
import { useCreateTodoItemMutation } from '../api/todoApi';
import styles from './TodoListDetail.module.css';

const MIN_DESCRIPTION_LENGTH = 5;

interface AddItemFormProps {
  listId: number;
  onItemCreated?: () => void;
}

export function AddItemForm({ listId, onItemCreated }: AddItemFormProps) {
  const [createItem] = useCreateTodoItemMutation();
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setDescription('');
    setError('');
  }, [listId]);

  const handleSubmit = async () => {
    const trimmed = description.trim();
    if (trimmed.length < MIN_DESCRIPTION_LENGTH) {
      setError(`Description must be at least ${MIN_DESCRIPTION_LENGTH} characters`);
      return;
    }

    setError('');
    const result = await createItem({ listId, description: trimmed });
    if ('error' in result) {
      setError('Failed to add item. Please try again.');
    } else {
      setDescription('');
      onItemCreated?.();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className={styles.formGroup}>
      <div className={styles.addForm}>
        <input
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          type="text"
          placeholder="Add a new item..."
          value={description}
          onChange={(e) => { setDescription(e.target.value); setError(''); }}
          onKeyDown={handleKeyDown}
        />
        <button className={styles.addButton} onClick={handleSubmit}>
          Add
        </button>
      </div>
      {error && <p className={styles.fieldError}>{error}</p>}
    </div>
  );
}
