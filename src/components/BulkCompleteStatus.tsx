import { useEffect } from 'react';
import { ProgressBar } from './ProgressBar';
import { ErrorBanner } from './ErrorBanner';
import type { BulkCompleteStatus as Status } from '../cable/useTodoListChannel';
import styles from './TodoListDetail.module.css';

const AUTO_DISMISS_MS = 3000;

interface BulkCompleteStatusProps {
  status: Status;
  onReset: () => void;
  onRetry: () => void;
}

export function BulkCompleteStatus({ status, onReset, onRetry }: BulkCompleteStatusProps) {
  useEffect(() => {
    if (status.state !== 'done') return;
    const timer = setTimeout(onReset, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [status.state, onReset]);

  if (status.state === 'running') {
    return <ProgressBar completed={status.completed} total={status.total} />;
  }

  if (status.state === 'done') {
    return (
      <div className={styles.successBanner}>
        Completed {status.completed} items
      </div>
    );
  }

  if (status.state === 'error') {
    return (
      <ErrorBanner
        message="Bulk completion failed. Some items may have been completed."
        onRetry={onRetry}
      />
    );
  }

  return null;
}
