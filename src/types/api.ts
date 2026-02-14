export interface TodoList {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface TodoItem {
  id: number;
  description: string;
  completed: boolean;
  todoListId: number;
  createdAt: string;
  updatedAt: string;
}
