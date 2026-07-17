import { useLanguage } from '../context/LanguageContext';
import type { LangCode } from '../i18n/translations';

export function LanguageSwitcher() {
  const { lang, setLang, languages } = useLanguage();

  return (
    <div>
      <label htmlFor="language-select" className="sr-only">
        Choose language
      </label>
      <select
        id="language-select"
        value={lang}
        onChange={(e) => setLang(e.target.value as LangCode)}
        className="hc-invert rounded-pitch border-2 border-trophy-gold bg-pitch-dark px-3 py-1.5 text-sm font-medium text-field-white focus-visible:outline-none"
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
