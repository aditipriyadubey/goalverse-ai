import { useState, type FormEvent } from 'react';
import { AccessibilityPanel } from '../components/AccessibilityPanel';
import { api } from '../services/api';
import { useAsyncAction } from '../hooks/useAsyncAction';

export function AccessibilityPage() {
  const [need, setNeed] = useState('');
  const { data, loading, error, run } = useAsyncAction(api.accessibility.route);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (need.trim().length < 2) return;
    run(need);
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-pitch-dark">Accessibility</h1>
        <p className="mt-1 text-pitch-dark/80">Adjust how the app looks and behaves, or ask for a step-free route.</p>
      </div>

      <AccessibilityPanel />

      <section aria-labelledby="route-heading">
        <h2 id="route-heading" className="font-scoreboard text-lg uppercase text-fifa-blue">
          Step-free route finder
        </h2>
        <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3 sm:flex-row" aria-label="Accessibility route request">
          <label htmlFor="need" className="sr-only">
            Describe your accessibility need
          </label>
          <input
            id="need"
            value={need}
            onChange={(e) => setNeed(e.target.value)}
            placeholder="e.g. I use a wheelchair and need the quietest route to Section 114"
            className="flex-1 rounded-pitch border-2 border-pitch/30 px-3 py-2 focus-visible:outline-none"
            minLength={2}
            maxLength={200}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-pitch bg-fifa-blue px-5 py-2 font-semibold text-field-white shadow disabled:opacity-60"
          >
            {loading ? 'Finding route…' : 'Find route'}
          </button>
        </form>

        <div aria-live="polite" className="mt-4">
          {error && (
            <p role="alert" className="rounded-pitch border-2 border-penalty-red bg-penalty-red/10 p-3 text-penalty-red">
              {error}
            </p>
          )}
          {data && (
            <div className="rounded-pitch border-2 border-fifa-blue bg-fifa-blue/5 p-4">
              <p className="text-sm text-pitch-dark">{data.summary}</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
                {data.route.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
              {data.facilities.length > 0 && (
                <p className="mt-2 text-sm text-pitch-dark/70">Nearby: {data.facilities.join(', ')}</p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
