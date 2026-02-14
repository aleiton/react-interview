import styles from './Skeleton.module.css';

interface SkeletonProps {
  lines?: number;
  dark?: boolean;
}

export function Skeleton({ lines = 3, dark = false }: SkeletonProps) {
  const widths = ['100%', '80%', '60%', '90%', '70%'];

  return (
    <div className={styles.container}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={`${styles.line} ${dark ? styles.dark : styles.light}`}
          style={{ width: widths[i % widths.length] }}
        />
      ))}
    </div>
  );
}
