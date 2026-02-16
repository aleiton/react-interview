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
  const [userSelected, setUserSelected] = useState(false);

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

  // Update URL only in response to user selections (not initial resolution)
  useEffect(() => {
    if (!resolved || !userSelected) return;

    if (selectedId !== null) {
      const list = lists.find((l) => l.id === selectedId);
      if (list) {
        history.replaceState(null, '', `/${list.id}`);
        return;
      }
    }
    history.replaceState(null, '', '/');
  }, [selectedId, lists, resolved, userSelected]);

  const select = useCallback((id: number | null) => {
    setUserSelected(true);
    setSelectedId(id);
  }, []);

  return { selectedId, select, resolved } as const;
}
