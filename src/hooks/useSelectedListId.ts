import { useState, useCallback, useEffect } from 'react';
import { slugify } from '../utils/slugify';

interface ListInfo {
  id: number;
  name: string;
}

function getSlugFromPath(): string {
  return window.location.pathname.slice(1); // remove leading /
}

export function useSelectedListId(lists: ListInfo[]) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [resolved, setResolved] = useState(false);

  // Resolve slug from URL once lists are loaded
  useEffect(() => {
    if (lists.length === 0) return;
    if (resolved) return;

    const slug = getSlugFromPath();
    if (slug) {
      const match = lists.find((l) => slugify(l.name) === slug);
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
        history.replaceState(null, '', `/${slugify(list.name)}`);
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
