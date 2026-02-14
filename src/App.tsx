import { useState } from 'react';
import { TodoListSidebar } from './components/TodoListSidebar';
import { TodoListDetail } from './components/TodoListDetail';
import './styles/design-tokens.css';
import styles from './App.module.css';

function App() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div className={styles.layout}>
      <TodoListSidebar selectedId={selectedId} onSelect={setSelectedId} />
      <TodoListDetail listId={selectedId} />
    </div>
  );
}

export default App;
