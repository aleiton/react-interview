import { useState, useRef, useEffect, useCallback } from 'react';

interface UseInlineEditOptions {
  onSave: (value: string) => void;
  disabled?: boolean;
}

export function useInlineEdit({ onSave, disabled = false }: UseInlineEditOptions) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const startEditing = useCallback((currentValue: string) => {
    if (disabled) return;
    savingRef.current = false;
    setEditing(true);
    setEditValue(currentValue);
  }, [disabled]);

  const cancelEditing = useCallback(() => {
    savingRef.current = true;
    setEditing(false);
    setEditValue('');
  }, []);

  const saveEditing = useCallback(() => {
    if (savingRef.current) return;
    savingRef.current = true;
    const trimmed = editValue.trim();
    if (trimmed) {
      onSave(trimmed);
    }
    setEditing(false);
    setEditValue('');
  }, [editValue, onSave]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEditing();
    if (e.key === 'Escape') cancelEditing();
  }, [saveEditing, cancelEditing]);

  return {
    editing,
    editValue,
    setEditValue,
    inputRef,
    startEditing,
    cancelEditing,
    saveEditing,
    handleKeyDown,
  };
}
