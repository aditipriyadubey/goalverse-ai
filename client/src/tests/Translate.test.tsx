import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import { TranslatePage } from '../pages/Translate';

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

function mockTranslateResponse() {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      detectedLanguage: 'en',
      translatedText: 'Donde esta la salida mas cercana',
      targetLanguage: 'es',
      aiSource: 'mock',
    }),
  }) as unknown as typeof fetch;
}

describe('TranslatePage', () => {
  it('renders a text field, language selector, and submit button', () => {
    render(<TranslatePage />);
    expect(screen.getByLabelText(/your text/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/translate to/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /translate/i })).toBeInTheDocument();
  });

  it('submits the text and target language, then displays the translated result', async () => {
    mockTranslateResponse();
    render(<TranslatePage />);

    fireEvent.change(screen.getByLabelText(/your text/i), {
      target: { value: 'Where is the nearest exit?' },
    });
    fireEvent.click(screen.getByRole('button', { name: /translate/i }));

    await waitFor(() => {
      expect(screen.getByText(/Donde esta la salida mas cercana/)).toBeInTheDocument();
    });
    expect(screen.getByText(/Detected: en → es/)).toBeInTheDocument();
  });

  it('does not submit when the text field is empty', () => {
    mockTranslateResponse();
    render(<TranslatePage />);
    fireEvent.click(screen.getByRole('button', { name: /translate/i }));
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<TranslatePage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});