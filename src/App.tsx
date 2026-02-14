import { useState } from 'react';
import { TodoListSidebar } from './components/TodoListSidebar';
import { TodoListDetail } from './components/TodoListDetail';
import { ErrorBoundary } from './components/ErrorBoundary';
import './styles/design-tokens.css';
import styles from './App.module.css';

function App() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div className={styles.layout}>
      <ErrorBoundary>
        <TodoListSidebar selectedId={selectedId} onSelect={setSelectedId} />
      </ErrorBoundary>
      <ErrorBoundary>
        <TodoListDetail listId={selectedId} />
      </ErrorBoundary>
    </div>
  );
}

export default App;
