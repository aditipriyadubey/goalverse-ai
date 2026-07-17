import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { axe } from 'jest-axe';
import { GoalCard } from '../components/GoalCard';

function renderCard() {
  return render(
    <MemoryRouter>
      <GoalCard to="/navigator" title="Navigator" description="Find your way around" />
    </MemoryRouter>,
  );
}

describe('GoalCard', () => {
  it('renders as an accessible link with the given title and description', () => {
    renderCard();
    const link = screen.getByRole('link', { name: /navigator/i });
    expect(link).toHaveAttribute('href', '/navigator');
    expect(screen.getByText('Find your way around')).toBeInTheDocument();
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = renderCard();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
