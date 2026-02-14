import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders the correct number of placeholder lines with varying widths', () => {
    const { container } = render(<Skeleton lines={4} />);

    const lines = container.querySelectorAll('[class*="line"]');
    expect(lines).toHaveLength(4);

    const widths = Array.from(lines).map((el) => (el as HTMLElement).style.width);
    expect(widths).toEqual(['100%', '80%', '60%', '90%']);
  });

  it('defaults to 3 lines and applies light variant', () => {
    const { container } = render(<Skeleton />);

    const lines = container.querySelectorAll('[class*="line"]');
    expect(lines).toHaveLength(3);

    const firstLine = lines[0];
    expect(firstLine.className).toContain('light');
  });

  it('applies dark variant when dark prop is set', () => {
    const { container } = render(<Skeleton dark />);

    const firstLine = container.querySelector('[class*="line"]');
    expect(firstLine?.className).toContain('dark');
  });
});
