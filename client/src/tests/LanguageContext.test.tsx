import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';

function TestConsumer() {
  const { lang, setLang, t, isRtl } = useLanguage();
  return (
    <div>
      <p data-testid="lang">{lang}</p>
      <p data-testid="rtl">{String(isRtl)}</p>
      <p data-testid="tagline">{t('tagline')}</p>
      <button onClick={() => setLang('ar')}>switch to arabic</button>
      <button onClick={() => setLang('es')}>switch to spanish</button>
    </div>
  );
}

describe('LanguageContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('defaults to English UI strings', () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>,
    );
    expect(screen.getByTestId('tagline').textContent).toBe('Where the Stadium Thinks Like a Team');
  });

  it('switches language and updates translated strings', () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>,
    );
    fireEvent.click(screen.getByText('switch to spanish'));
    expect(screen.getByTestId('lang').textContent).toBe('es');
    expect(screen.getByTestId('tagline').textContent).toMatch(/Estadio/);
  });

  it('marks Arabic as a right-to-left language and sets document dir', () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>,
    );
    fireEvent.click(screen.getByText('switch to arabic'));
    expect(screen.getByTestId('rtl').textContent).toBe('true');
    expect(document.documentElement.dir).toBe('rtl');
  });
});
