import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ErrorBanner } from './ErrorBanner';

describe('ErrorBanner', () => {
  it('renders the error message and fires onRetry when clicking Retry', async () => {
    const onRetry = vi.fn();
    render(<ErrorBanner message="Something broke" onRetry={onRetry} />);

    expect(screen.getByText('Something broke')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Retry'));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
