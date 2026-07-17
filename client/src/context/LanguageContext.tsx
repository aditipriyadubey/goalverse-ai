import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { LANGUAGE_LABELS, RTL_LANGS, UI_STRINGS, type LangCode } from '../i18n/translations';

interface LanguageContextValue {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: (key: string) => string;
  isRtl: boolean;
  languages: { code: LangCode; label: string }[];
}

const STORAGE_KEY = 'goalverse-language';
const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function detectInitialLang(): LangCode {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(STORAGE_KEY) as LangCode | null;
  if (stored && UI_STRINGS[stored]) return stored;
  const browserLang = window.navigator.language.slice(0, 2);
  return (Object.keys(UI_STRINGS) as LangCode[]).includes(browserLang as LangCode)
    ? (browserLang as LangCode)
    : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(detectInitialLang);
  const isRtl = RTL_LANGS.includes(lang);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [lang, isRtl]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang: setLangState,
      t: (key: string) => UI_STRINGS[lang][key] ?? UI_STRINGS.en[key] ?? key,
      isRtl,
      languages: (Object.keys(UI_STRINGS) as LangCode[]).map((code) => ({ code, label: LANGUAGE_LABELS[code] })),
    }),
    [lang, isRtl],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
