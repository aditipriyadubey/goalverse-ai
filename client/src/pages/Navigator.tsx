import { useEffect, useRef, useState, type FormEvent } from 'react';
import { api } from '../services/api';
import { useAsyncAction } from '../hooks/useAsyncAction';
import { useDebounce } from '../hooks/useDebounce';

const EXAMPLES = ['Nearest washroom', 'I need wheelchair access', 'Where is merchandise?', 'Nearest halal food'];

export function NavigatorPage() {
  const [query, setQuery] = useState('');
  const [fromGate, setFromGate] = useState('Gate 1');
  const { data, loading, error, run } = useAsyncAction(api.navigator.query);

  // Debounce the free-text query so we don't fire an AI request on every
  // keystroke — only after the fan pauses typing for 500ms. This is what
  // keeps live-as-you-type search cheap on both API calls and rate-limit
  // budget (see server/src/middleware/security.ts's aiRateLimiter).
  const debouncedQuery = useDebounce(query, 500);
  const lastAutoRunQuery = useRef<string>('');

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed.length < 3 || trimmed === lastAutoRunQuery.current) return;
    lastAutoRunQuery.current = trimmed;
    run(trimmed, fromGate);
    // fromGate intentionally excluded: changing the starting gate alone
    // shouldn't re-trigger a search until the fan changes their question too.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    lastAutoRunQuery.current = trimmed;
    run(trimmed, fromGate);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-pitch-dark">Ask the Navigator</h1>
      <p className="mt-1 text-pitch-dark/80">Tell it where you are and what you need — it'll find the play.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" aria-label="Stadium navigation request">
        <div>
          <label htmlFor="from-gate" className="block text-sm font-semibold text-pitch-dark">
            Starting from
          </label>
          <input
            id="from-gate"
            type="text"
            value={fromGate}
            onChange={(e) => setFromGate(e.target.value)}
            className="mt-1 w-full rounded-pitch border-2 border-pitch/30 px-3 py-2 focus-visible:outline-none"
          />
        </div>
        <div>
          <label htmlFor="query" className="block text-sm font-semibold text-pitch-dark">
            What are you looking for?
          </label>
          <input
            id="query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Nearest washroom"
            className="mt-1 w-full rounded-pitch border-2 border-pitch/30 px-3 py-2 focus-visible:outline-none"
            minLength={2}
            maxLength={300}
            required
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setQuery(ex)}
              className="rounded-pitch border border-fifa-blue/40 px-3 py-1 text-xs font-medium text-fifa-blue hover:bg-fifa-blue/10"
            >
              {ex}
            </button>
          ))}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-pitch bg-cheer-orangeDark px-5 py-2 font-semibold text-field-white shadow disabled:opacity-60"
        >
          {loading ? 'Finding the route…' : 'Find my route'}
        </button>
      </form>

      <div aria-live="polite" className="mt-6">
        {error && (
          <p role="alert" className="rounded-pitch border-2 border-penalty-red bg-penalty-red/10 p-3 text-penalty-red">
            {error}
          </p>
        )}
        {data && (
          <div className="rounded-pitch border-2 border-pitch bg-pitch/5 p-4">
            <p className="font-scoreboard text-lg text-pitch-dark">➡ {data.destination}</p>
            <p className="mt-1 text-sm text-pitch-dark/80">{data.summary}</p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-pitch-dark">
              {data.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            <p className="mt-3 text-sm font-semibold text-fifa-blue">≈ {data.estimatedMinutes} min walk</p>
            {data.accessibilityNote && (
              <p className="mt-2 rounded-pitch bg-trophy-gold/20 p-2 text-sm text-pitch-dark">
                ♿ {data.accessibilityNote}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}