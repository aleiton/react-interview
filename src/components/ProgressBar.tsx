import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={styles.container}>
      <div className={styles.bar} style={{ width: `${percentage}%` }} />
      <span className={styles.label}>
        {completed}/{total} ({percentage}%)
      </span>
    </div>
  );
}
