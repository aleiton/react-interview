export type TodoListBroadcast =
  | { action: 'progress'; completed: number; total: number }
  | { action: 'completed'; completed: number; total: number }
  | { action: 'error' };
