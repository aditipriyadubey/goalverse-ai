import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AccessibilityProvider } from '../context/AccessibilityContext';
import { AccessibilityPanel } from '../components/AccessibilityPanel';

function renderPanel() {
  return render(
    <AccessibilityProvider>
      <AccessibilityPanel />
    </AccessibilityProvider>,
  );
}

describe('AccessibilityPanel', () => {
  it('renders all four settings controls', () => {
    renderPanel();
    expect(screen.getByLabelText(/high contrast/i)).toBeInTheDocument();
    expect(screen.getByText(/reduce motion/i)).toBeInTheDocument();
    expect(screen.getByText(/dark mode/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /increase text size/i })).toBeInTheDocument();
  });

  it('toggles the high contrast checkbox on click', () => {
    renderPanel();
    const checkbox = screen.getByLabelText(/high contrast/i) as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  it('increases the displayed text size percentage', () => {
    renderPanel();
    fireEvent.click(screen.getByRole('button', { name: /increase text size/i }));
    expect(screen.getByText(/110%/)).toBeInTheDocument();
  });
});
