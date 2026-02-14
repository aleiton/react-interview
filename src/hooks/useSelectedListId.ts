import { useState, useCallback, useEffect } from 'react';

function getInitialListId(): number | null {
  const param = new URLSearchParams(window.location.search).get('list');
  const parsed = param ? Number(param) : NaN;
  return Number.isFinite(parsed) ? parsed : null;
}

export function useSelectedListId() {
  const [selectedId, setSelectedId] = useState<number | null>(getInitialListId);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedId !== null) {
      url.searchParams.set('list', String(selectedId));
    } else {
      url.searchParams.delete('list');
    }
    history.replaceState(null, '', url);
  }, [selectedId]);

  const select = useCallback((id: number | null) => {
    setSelectedId(id);
  }, []);

  return { selectedId, select } as const;
}
