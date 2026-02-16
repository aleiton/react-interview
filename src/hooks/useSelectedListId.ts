import { useState, useCallback, useEffect } from 'react';

interface ListInfo {
  id: number;
  name: string;
}

function getIdFromPath(): number | null {
  const segment = window.location.pathname.slice(1);
  const parsed = Number(segment);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function useSelectedListId(lists: ListInfo[]) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [resolved, setResolved] = useState(false);

  // Resolve ID from URL once lists are loaded
  useEffect(() => {
    if (lists.length === 0) return;
    if (resolved) return;

    const id = getIdFromPath();
    if (id !== null) {
      const match = lists.find((l) => l.id === id);
      if (match) setSelectedId(match.id);
    }
    setResolved(true);
  }, [lists, resolved]);

  // Update URL when selection changes
  useEffect(() => {
    if (!resolved) return;

    if (selectedId !== null) {
      const list = lists.find((l) => l.id === selectedId);
      if (list) {
        history.replaceState(null, '', `/${list.id}`);
        return;
      }
    }
    history.replaceState(null, '', '/');
  }, [selectedId, lists, resolved]);

  const select = useCallback((id: number | null) => {
    setSelectedId(id);
  }, []);

  return { selectedId, select, resolved } as const;
}
