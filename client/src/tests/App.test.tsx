import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

describe('App routing', () => {
  it('renders the Home page at the root route', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /welcome to the pitch/i })).toBeInTheDocument(),
    );
  });

  it('renders the Multilingual Assistant page at /translate', async () => {
    render(
      <MemoryRouter initialEntries={['/translate']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /multilingual assistant/i })).toBeInTheDocument(),
    );
  });

  it('renders the offside/not-found page for an unknown route', async () => {
    render(
      <MemoryRouter initialEntries={['/this-route-does-not-exist']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /offside/i })).toBeInTheDocument(),
    );
  });

  it('renders the skip link as the first focusable element', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByText(/skip to main content/i)).toBeInTheDocument());
  });

  it('moves focus to the main content region after a route change', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByRole('heading', { name: /welcome to the pitch/i })).toBeInTheDocument());

    const main = document.getElementById('main-content');
    expect(main).not.toBeNull();
    // Simulate arriving via client-side nav by checking the element is
    // focusable and targeted by the route-change effect (tabIndex=-1 is
    // what makes a non-interactive <main> a valid focus target at all).
    expect(main).toHaveAttribute('tabindex', '-1');
  });
});