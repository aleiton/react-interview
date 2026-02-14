import { useState, useCallback } from 'react';
import { TodoListSidebar } from './components/TodoListSidebar';
import { TodoListDetail } from './components/TodoListDetail';
import { ErrorBoundary } from './components/ErrorBoundary';
import './styles/design-tokens.css';
import styles from './App.module.css';

function App() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSelect = useCallback((id: number | null) => {
    setSelectedId(id);
    setSidebarOpen(false);
  }, []);

  return (
    <div className={styles.layout}>
      <button
        className={styles.hamburger}
        onClick={() => setSidebarOpen((prev) => !prev)}
        aria-label="Toggle sidebar"
      >
        &#9776;
      </button>

      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <ErrorBoundary>
        <div className={`${styles.sidebarWrapper} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <TodoListSidebar selectedId={selectedId} onSelect={handleSelect} />
        </div>
      </ErrorBoundary>
      <ErrorBoundary>
        <TodoListDetail listId={selectedId} />
      </ErrorBoundary>
    </div>
  );
}

export default App;
