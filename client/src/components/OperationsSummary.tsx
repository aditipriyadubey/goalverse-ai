import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { VolunteerSummaryResult } from '../types/api';

/** Fetches and displays the AI-generated "what needs attention right now" summary. */
export function OperationsSummary() {
  const [summary, setSummary] = useState<VolunteerSummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.volunteer
      .summary()
      .then(setSummary)
      .catch(() => setError('Could not load the AI operations summary right now.'));
  }, []);

  return (
    <section aria-labelledby="summary-heading" className="rounded-pitch border-2 border-fifa-blue/30 bg-fifa-blue/5 p-4">
      <h2 id="summary-heading" className="font-scoreboard text-lg uppercase text-fifa-blue">
        Right now
      </h2>
      {error && (
        <p role="alert" className="mt-2 text-penalty-red">
          {error}
        </p>
      )}
      {summary && (
        <>
          <p className="mt-2 text-sm text-pitch-dark">{summary.summary}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {summary.priorityActions.map((action, i) => (
              <li key={i}>{action}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}