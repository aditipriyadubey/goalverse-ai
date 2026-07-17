import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { IncidentForm } from '../components/IncidentForm';
import { LostFoundForm } from '../components/LostFoundForm';

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe('Volunteer desk forms — accessibility', () => {
  it('IncidentForm exposes labeled controls for every field', () => {
    render(<IncidentForm />);
    expect(screen.getByLabelText(/incident type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/severity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^zone$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('IncidentForm has no detectable accessibility violations', async () => {
    const { container } = render(<IncidentForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('LostFoundForm exposes labeled controls for every field', () => {
    render(<LostFoundForm />);
    expect(screen.getByLabelText(/item description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^location$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reported by/i)).toBeInTheDocument();
  });

  it('LostFoundForm has no detectable accessibility violations', async () => {
    const { container } = render(<LostFoundForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});