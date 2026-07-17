import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export function ScoreboardHeader() {
  const { t } = useLanguage();
  return (
    <header className="relative z-10 border-b-4 border-trophy-gold bg-pitch-dark text-field-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          {/* SVG pitch circle mark — no emoji */}
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-trophy-gold bg-pitch"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-trophy-gold" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" className="stroke-trophy-gold" />
              <circle cx="12" cy="12" r="3" className="fill-trophy-gold" />
              <line x1="12" y1="2" x2="12" y2="22" strokeWidth="1" className="stroke-trophy-gold" stroke="currentColor" />
              <line x1="2" y1="12" x2="22" y2="12" strokeWidth="1" className="stroke-trophy-gold" stroke="currentColor" />
            </svg>
          </span>
          <div className="leading-tight">
            <p className="font-scoreboard text-xl uppercase tracking-wide text-trophy-gold">{t('appName')}</p>
            <p className="font-display text-sm italic text-field-white/80">{t('tagline')}</p>
          </div>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
