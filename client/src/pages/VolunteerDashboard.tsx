import { useEffect, useState, type FormEvent } from 'react';
import { api } from '../services/api';
import { useAsyncAction } from '../hooks/useAsyncAction';
import type { VolunteerSummaryResult } from '../types/api';

export function VolunteerDashboardPage() {
  const [summary, setSummary] = useState<VolunteerSummaryResult | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const [lostForm, setLostForm] = useState({ itemDesc: '', location: '', reportedBy: '' });
  const lostAction = useAsyncAction(api.volunteer.reportLostFound);

  const [incidentForm, setIncidentForm] = useState({
    type: 'medical' as 'medical' | 'crowd' | 'security' | 'facilities',
    severity: 'low' as 'low' | 'medium' | 'high',
    zone: '',
    description: '',
  });
  const incidentAction = useAsyncAction(api.volunteer.reportIncident);

  useEffect(() => {
    api.volunteer
      .summary()
      .then(setSummary)
      .catch(() => setSummaryError('Could not load the AI operations summary right now.'));
  }, []);

  function submitLostFound(e: FormEvent) {
    e.preventDefault();
    lostAction.run(lostForm).then((result) => {
      if (result) setLostForm({ itemDesc: '', location: '', reportedBy: '' });
    });
  }

  function submitIncident(e: FormEvent) {
    e.preventDefault();
    incidentAction.run(incidentForm).then((result) => {
      if (result) setIncidentForm((f) => ({ ...f, description: '' }));
    });
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-pitch-dark">Volunteer Desk</h1>
        <p className="mt-1 text-pitch-dark/80">Log what's happening on the ground; the AI keeps the summary current.</p>
      </div>

      <section aria-labelledby="summary-heading" className="rounded-pitch border-2 border-fifa-blue/30 bg-fifa-blue/5 p-4">
        <h2 id="summary-heading" className="font-scoreboard text-lg uppercase text-fifa-blue">
          Right now
        </h2>
        {summaryError && <p role="alert" className="mt-2 text-penalty-red">{summaryError}</p>}
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

      <section aria-labelledby="lostfound-heading">
        <h2 id="lostfound-heading" className="font-scoreboard text-lg uppercase text-fifa-blue">
          Report lost &amp; found
        </h2>
        <form onSubmit={submitLostFound} className="mt-3 grid gap-3 sm:grid-cols-3">
          <input
            aria-label="Item description"
            required
            placeholder="Item description"
            value={lostForm.itemDesc}
            onChange={(e) => setLostForm((f) => ({ ...f, itemDesc: e.target.value }))}
            className="rounded-pitch border-2 border-pitch/30 px-3 py-2 focus-visible:outline-none"
          />
          <input
            aria-label="Location"
            required
            placeholder="Location"
            value={lostForm.location}
            onChange={(e) => setLostForm((f) => ({ ...f, location: e.target.value }))}
            className="rounded-pitch border-2 border-pitch/30 px-3 py-2 focus-visible:outline-none"
          />
          <input
            aria-label="Reported by"
            required
            placeholder="Reported by"
            value={lostForm.reportedBy}
            onChange={(e) => setLostForm((f) => ({ ...f, reportedBy: e.target.value }))}
            className="rounded-pitch border-2 border-pitch/30 px-3 py-2 focus-visible:outline-none"
          />
          <button
            type="submit"
            disabled={lostAction.loading}
            className="sm:col-span-3 rounded-pitch bg-cheer-orange px-4 py-2 font-semibold text-field-white disabled:opacity-60"
          >
            {lostAction.loading ? 'Submitting…' : 'Submit report'}
          </button>
        </form>
        {lostAction.error && <p role="alert" className="mt-2 text-penalty-red">{lostAction.error}</p>}
        {lostAction.data && <p role="status" className="mt-2 text-pitch">Report logged.</p>}
      </section>

      <section aria-labelledby="incident-heading">
        <h2 id="incident-heading" className="font-scoreboard text-lg uppercase text-fifa-blue">
          Report an incident
        </h2>
        <form onSubmit={submitIncident} className="mt-3 grid gap-3 sm:grid-cols-2">
          <select
            aria-label="Incident type"
            value={incidentForm.type}
            onChange={(e) => setIncidentForm((f) => ({ ...f, type: e.target.value as typeof f.type }))}
            className="rounded-pitch border-2 border-pitch/30 px-3 py-2"
          >
            <option value="medical">Medical</option>
            <option value="crowd">Crowd</option>
            <option value="security">Security</option>
            <option value="facilities">Facilities</option>
          </select>
          <select
            aria-label="Severity"
            value={incidentForm.severity}
            onChange={(e) => setIncidentForm((f) => ({ ...f, severity: e.target.value as typeof f.severity }))}
            className="rounded-pitch border-2 border-pitch/30 px-3 py-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            aria-label="Zone"
            required
            placeholder="Zone (e.g. North concourse)"
            value={incidentForm.zone}
            onChange={(e) => setIncidentForm((f) => ({ ...f, zone: e.target.value }))}
            className="rounded-pitch border-2 border-pitch/30 px-3 py-2 focus-visible:outline-none sm:col-span-2"
          />
          <textarea
            aria-label="Description"
            required
            placeholder="What happened?"
            value={incidentForm.description}
            onChange={(e) => setIncidentForm((f) => ({ ...f, description: e.target.value }))}
            className="rounded-pitch border-2 border-pitch/30 px-3 py-2 focus-visible:outline-none sm:col-span-2"
          />
          <button
            type="submit"
            disabled={incidentAction.loading}
            className="sm:col-span-2 rounded-pitch bg-penalty-red px-4 py-2 font-semibold text-field-white disabled:opacity-60"
          >
            {incidentAction.loading ? 'Submitting…' : 'Submit incident'}
          </button>
        </form>
        {incidentAction.error && <p role="alert" className="mt-2 text-penalty-red">{incidentAction.error}</p>}
        {incidentAction.data && <p role="status" className="mt-2 text-pitch">Incident logged.</p>}
      </section>
    </div>
  );
}
