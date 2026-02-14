import { useState, useEffect } from 'react';

const DEFAULT_DELAY_MS = 200;

export function useDelayedLoading(isLoading: boolean, delay = DEFAULT_DELAY_MS): boolean {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShow(false);
      return;
    }

    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [isLoading, delay]);

  return show;
}
