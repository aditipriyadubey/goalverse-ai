import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  fontScale: number; // 1 = 100%
  darkMode: boolean;
}

interface AccessibilityContextValue extends AccessibilitySettings {
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleDarkMode: () => void;
  increaseFontScale: () => void;
  decreaseFontScale: () => void;
  resetFontScale: () => void;
}

const STORAGE_KEY = 'goalverse-accessibility-settings';
const MIN_SCALE = 0.85;
const MAX_SCALE = 1.5;
const STEP = 0.1;

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  reducedMotion: false,
  fontScale: 1,
  darkMode: false,
};

const AccessibilityContext = createContext<AccessibilityContextValue | undefined>(undefined);

function loadSettings(): AccessibilitySettings {
  if (typeof window === 'undefined') return defaultSettings;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...(JSON.parse(raw) as Partial<AccessibilitySettings>) };
  } catch {
    return defaultSettings;
  }
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(loadSettings);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    const root = document.documentElement;
    root.classList.toggle('high-contrast', settings.highContrast);
    root.classList.toggle('reduce-motion', settings.reducedMotion);
    root.classList.toggle('dark', settings.darkMode);
    root.style.setProperty('--font-scale', String(settings.fontScale));
  }, [settings]);

  const value = useMemo<AccessibilityContextValue>(
    () => ({
      ...settings,
      toggleHighContrast: () => setSettings((s) => ({ ...s, highContrast: !s.highContrast })),
      toggleReducedMotion: () => setSettings((s) => ({ ...s, reducedMotion: !s.reducedMotion })),
      toggleDarkMode: () => setSettings((s) => ({ ...s, darkMode: !s.darkMode })),
      increaseFontScale: () =>
        setSettings((s) => ({ ...s, fontScale: Math.min(MAX_SCALE, Math.round((s.fontScale + STEP) * 100) / 100) })),
      decreaseFontScale: () =>
        setSettings((s) => ({ ...s, fontScale: Math.max(MIN_SCALE, Math.round((s.fontScale - STEP) * 100) / 100) })),
      resetFontScale: () => setSettings((s) => ({ ...s, fontScale: 1 })),
    }),
    [settings],
  );

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within an AccessibilityProvider');
  return ctx;
}
