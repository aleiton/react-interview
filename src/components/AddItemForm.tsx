import { useState, useEffect } from 'react';
import { useCreateTodoItemMutation } from '../api/todoApi';
import styles from './TodoListDetail.module.css';

interface AddItemFormProps {
  listId: number;
}

export function AddItemForm({ listId }: AddItemFormProps) {
  const [createItem] = useCreateTodoItemMutation();
  const [description, setDescription] = useState('');

  useEffect(() => {
    setDescription('');
  }, [listId]);

  const handleSubmit = async () => {
    const trimmed = description.trim();
    if (!trimmed) return;
    const result = await createItem({ listId, description: trimmed });
    if (!('error' in result)) setDescription('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className={styles.addForm}>
      <input
        className={styles.input}
        type="text"
        placeholder="Add a new item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className={styles.addButton} onClick={handleSubmit}>
        Add
      </button>
    </div>
  );
}
