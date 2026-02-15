import styles from './NotFound.module.css';

export function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>Page not found</p>
      <a href="/" className={styles.link}>Go back to the app</a>
    </div>
  );
}
