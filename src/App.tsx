import { useState, useCallback } from 'react';
import { TodoListSidebar } from './components/TodoListSidebar';
import { TodoListDetail } from './components/TodoListDetail';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useSelectedListId } from './hooks/useSelectedListId';
import './styles/design-tokens.css';
import styles from './App.module.css';

function App() {
  const { selectedId, select } = useSelectedListId();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSelect = useCallback((id: number | null) => {
    select(id);
    setSidebarOpen(false);
  }, [select]);

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
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
          role="presentation"
        />
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
