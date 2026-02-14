import styles from './Skeleton.module.css';

const WIDTHS = ['100%', '80%', '60%', '90%', '70%'];

interface SkeletonProps {
  lines?: number;
  dark?: boolean;
}

export function Skeleton({ lines = 3, dark = false }: SkeletonProps) {

  return (
    <div className={styles.container}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={`${styles.line} ${dark ? styles.dark : styles.light}`}
          style={{ width: WIDTHS[i % WIDTHS.length] }}
        />
      ))}
    </div>
  );
}
