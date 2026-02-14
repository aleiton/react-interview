import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TodoItem } from './TodoItem';
import type { TodoItem as TodoItemType } from '../types/api';

const baseItem: TodoItemType = {
  id: 1,
  description: 'Buy groceries',
  completed: false,
  todoListId: 1,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

describe('TodoItem', () => {
  it('renders description and checkbox, toggles on click', async () => {
    const onToggle = vi.fn();
    render(
      <TodoItem item={baseItem} onToggle={onToggle} onDelete={vi.fn()} onEdit={vi.fn()} />
    );

    expect(screen.getByText('Buy groceries')).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it('calls onDelete when clicking the delete button', async () => {
    const onDelete = vi.fn();
    render(
      <TodoItem item={baseItem} onToggle={vi.fn()} onDelete={onDelete} onEdit={vi.fn()} />
    );

    await userEvent.click(screen.getByText('\u00d7'));
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it('enters edit mode on double-click and saves on Enter', async () => {
    const onEdit = vi.fn();
    render(
      <TodoItem item={baseItem} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={onEdit} />
    );

    await userEvent.dblClick(screen.getByText('Buy groceries'));

    const input = screen.getByDisplayValue('Buy groceries');
    expect(input).toBeInTheDocument();

    await userEvent.clear(input);
    await userEvent.type(input, 'Buy milk{Enter}');
    expect(onEdit).toHaveBeenCalledWith('Buy milk');
  });

  it('cancels editing on Escape without calling onEdit', async () => {
    const onEdit = vi.fn();
    render(
      <TodoItem item={baseItem} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={onEdit} />
    );

    await userEvent.dblClick(screen.getByText('Buy groceries'));
    await userEvent.type(screen.getByDisplayValue('Buy groceries'), 'changed{Escape}');

    expect(onEdit).not.toHaveBeenCalled();
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  it('does not enter edit mode when item is completed', async () => {
    const completedItem = { ...baseItem, completed: true };
    render(
      <TodoItem item={completedItem} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />
    );

    await userEvent.dblClick(screen.getByText('Buy groceries'));
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
