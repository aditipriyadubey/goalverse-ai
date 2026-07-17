import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MatchCard } from '../components/MatchCard';

describe('MatchCard', () => {
  it('labels a red-level card as overloaded', () => {
    render(<MatchCard level="red" title="Gate 4 · 92%" />);
    expect(screen.getByText(/red card/i)).toBeInTheDocument();
    expect(screen.getByText('Gate 4 · 92%')).toBeInTheDocument();
  });

  it('labels a green-level card as flowing well', () => {
    render(<MatchCard level="green" title="Gate 1 · 10%" />);
    expect(screen.getByText(/flowing well/i)).toBeInTheDocument();
  });

  it('exposes a status role for assistive technology announcements', () => {
    render(<MatchCard level="yellow" title="Gate 2 · 50%" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
