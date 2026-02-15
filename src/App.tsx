import { useState, useCallback } from 'react';
import { useGetTodoListsQuery } from './api/todoApi';
import { TodoListSidebar } from './components/TodoListSidebar';
import { TodoListDetail } from './components/TodoListDetail';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NotFound } from './components/NotFound';
import { useSelectedListId } from './hooks/useSelectedListId';
import './styles/design-tokens.css';
import styles from './App.module.css';

function App() {
  const { data: lists = [], isLoading: listsLoading } = useGetTodoListsQuery();
  const { selectedId, select, resolved } = useSelectedListId(lists);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show 404 only after lists loaded and slug resolved
  const path = window.location.pathname;
  if (!listsLoading && resolved && path !== '/' && selectedId === null) {
    return <NotFound />;
  }

  const handleSelect = useCallback((id: number | null) => {
    select(id);
    setSidebarOpen(false);
  }, [select]);

  return (
    <div className={styles.layout}>
      <button
        className={styles.hamburger}
        onClick={() => setSidebarOpen((prev) => !prev)}
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {sidebarOpen ? '\u00D7' : '\u2630'}
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
        <TodoListDetail listId={selectedId} listName={lists.find((l) => l.id === selectedId)?.name} />
      </ErrorBoundary>
    </div>
  );
}

export default App;
