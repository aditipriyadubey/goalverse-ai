import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AccessibilityProvider, useAccessibility } from '../context/AccessibilityContext';

function TestConsumer() {
  const { highContrast, fontScale, toggleHighContrast, increaseFontScale, decreaseFontScale } = useAccessibility();
  return (
    <div>
      <p data-testid="contrast">{String(highContrast)}</p>
      <p data-testid="scale">{fontScale}</p>
      <button onClick={toggleHighContrast}>toggle contrast</button>
      <button onClick={increaseFontScale}>increase</button>
      <button onClick={decreaseFontScale}>decrease</button>
    </div>
  );
}

describe('AccessibilityContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.className = '';
  });

  it('defaults to high contrast off and 100% font scale', () => {
    render(
      <AccessibilityProvider>
        <TestConsumer />
      </AccessibilityProvider>,
    );
    expect(screen.getByTestId('contrast').textContent).toBe('false');
    expect(screen.getByTestId('scale').textContent).toBe('1');
  });

  it('toggles high contrast and reflects it on the document root', () => {
    render(
      <AccessibilityProvider>
        <TestConsumer />
      </AccessibilityProvider>,
    );
    fireEvent.click(screen.getByText('toggle contrast'));
    expect(screen.getByTestId('contrast').textContent).toBe('true');
    expect(document.documentElement.classList.contains('high-contrast')).toBe(true);
  });

  it('increases and decreases font scale within bounds', () => {
    render(
      <AccessibilityProvider>
        <TestConsumer />
      </AccessibilityProvider>,
    );
    fireEvent.click(screen.getByText('increase'));
    expect(Number(screen.getByTestId('scale').textContent)).toBeCloseTo(1.1);
    fireEvent.click(screen.getByText('decrease'));
    fireEvent.click(screen.getByText('decrease'));
    expect(Number(screen.getByTestId('scale').textContent)).toBeCloseTo(0.9);
  });
});
