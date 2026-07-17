import { useState, type FormEvent } from 'react';
import { api } from '../services/api';
import { useAsyncAction } from '../hooks/useAsyncAction';
import { LANGUAGE_LABELS, type LangCode } from '../i18n/translations';

const SUPPORTED: { code: LangCode; label: string }[] = (Object.keys(LANGUAGE_LABELS) as LangCode[]).map(
  (code) => ({ code, label: LANGUAGE_LABELS[code] }),
);

export function TranslatePage() {
  const [text, setText] = useState('');
  const [targetLang, setTargetLang] = useState<LangCode>('es');
  const { data, loading, error, run } = useAsyncAction(api.multilingual.translate);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (text.trim().length < 1) return;
    run(text, targetLang);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-pitch-dark">Multilingual Assistant</h1>
      <p className="mt-1 text-pitch-dark/80">
        Type a question in any language — it's auto-detected and translated for staff or fellow fans.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" aria-label="Translation request">
        <div>
          <label htmlFor="translate-text" className="block text-sm font-semibold text-pitch-dark">
            Your text
          </label>
          <textarea
            id="translate-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Where can I find a wheelchair-accessible entrance?"
            minLength={1}
            maxLength={500}
            required
            rows={3}
            className="mt-1 w-full rounded-pitch border-2 border-pitch/30 px-3 py-2 focus-visible:outline-none"
          />
        </div>
        <div>
          <label htmlFor="target-lang" className="block text-sm font-semibold text-pitch-dark">
            Translate to
          </label>
          <select
            id="target-lang"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value as LangCode)}
            className="mt-1 w-full max-w-xs rounded-pitch border-2 border-pitch/30 px-3 py-2 focus-visible:outline-none"
          >
            {SUPPORTED.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-pitch bg-fifa-blue px-5 py-2 font-semibold text-field-white shadow disabled:opacity-60"
        >
          {loading ? 'Translating…' : 'Translate'}
        </button>
      </form>

      <div aria-live="polite" className="mt-6">
        {error && (
          <p role="alert" className="rounded-pitch border-2 border-penalty-red bg-penalty-red/10 p-3 text-penalty-red">
            {error}
          </p>
        )}
        {data && (
          <div className="rounded-pitch border-2 border-fifa-blue bg-fifa-blue/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-fifa-blue">
              Detected: {data.detectedLanguage} → {data.targetLanguage}
            </p>
            <p className="mt-2 text-pitch-dark">{data.translatedText}</p>
          </div>
        )}
      </div>
    </div>
  );
}