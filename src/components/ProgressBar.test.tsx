import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('renders percentage label and sets bar width', () => {
    const { container } = render(<ProgressBar completed={25} total={100} />);

    expect(screen.getByText('25/100 (25%)')).toBeInTheDocument();

    const bar = container.querySelector('[class*="bar"]') as HTMLElement;
    expect(bar.style.width).toBe('25%');
  });

  it('handles zero total without dividing by zero', () => {
    render(<ProgressBar completed={0} total={0} />);

    expect(screen.getByText('0/0 (0%)')).toBeInTheDocument();
  });

  it('rounds percentage to nearest integer', () => {
    render(<ProgressBar completed={1} total={3} />);

    expect(screen.getByText('1/3 (33%)')).toBeInTheDocument();
  });
});
