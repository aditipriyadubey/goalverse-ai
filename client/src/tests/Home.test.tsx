import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { axe } from 'jest-axe';
import { Home } from '../pages/Home';

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );
}

describe('Home page', () => {
  it('renders a heading and links to every major feature', () => {
    renderHome();
    expect(screen.getByRole('heading', { name: /welcome to the pitch/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /navigator/i })).toHaveAttribute('href', '/navigator');
    expect(screen.getByRole('link', { name: /crowd watch/i })).toHaveAttribute('href', '/crowd');
    expect(screen.getByRole('link', { name: /match planner/i })).toHaveAttribute('href', '/planner');
    expect(screen.getByRole('link', { name: /multilingual assistant/i })).toHaveAttribute('href', '/translate');
    expect(screen.getByRole('link', { name: /accessibility/i })).toHaveAttribute('href', '/accessibility');
    expect(screen.getByRole('link', { name: /eco score/i })).toHaveAttribute('href', '/eco');
    expect(screen.getByRole('link', { name: /volunteer desk/i })).toHaveAttribute('href', '/volunteer');
    expect(screen.getByRole('link', { name: /control room/i })).toHaveAttribute('href', '/organizer');
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = renderHome();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});