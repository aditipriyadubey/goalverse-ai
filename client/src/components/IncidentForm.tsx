import { useState, type FormEvent } from 'react';
import { api } from '../services/api';
import { useAsyncAction } from '../hooks/useAsyncAction';

/** Self-contained incident reporting form for the volunteer desk. */
export function IncidentForm() {
  const [form, setForm] = useState({
    type: 'medical' as 'medical' | 'crowd' | 'security' | 'facilities',
    severity: 'low' as 'low' | 'medium' | 'high',
    zone: '',
    description: '',
  });
  const { data, loading, error, run } = useAsyncAction(api.volunteer.reportIncident);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    run(form).then((result) => {
      if (result) setForm((f) => ({ ...f, description: '' }));
    });
  }

  return (
    <section aria-labelledby="incident-heading">
      <h2 id="incident-heading" className="font-scoreboard text-lg uppercase text-fifa-blue">
        Report an incident
      </h2>
      <form onSubmit={handleSubmit} className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="incident-type" className="text-sm font-medium text-pitch-dark">
            Incident type
          </label>
          <select
            id="incident-type"
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as typeof f.type }))}
            className="rounded-pitch border-2 border-pitch/30 px-3 py-2"
          >
            <option value="medical">Medical</option>
            <option value="crowd">Crowd</option>
            <option value="security">Security</option>
            <option value="facilities">Facilities</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="incident-severity" className="text-sm font-medium text-pitch-dark">
            Severity
          </label>
          <select
            id="incident-severity"
            value={form.severity}
            onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value as typeof f.severity }))}
            className="rounded-pitch border-2 border-pitch/30 px-3 py-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label htmlFor="incident-zone" className="text-sm font-medium text-pitch-dark">
            Zone
          </label>
          <input
            id="incident-zone"
            required
            placeholder="Zone (e.g. North concourse)"
            value={form.zone}
            onChange={(e) => setForm((f) => ({ ...f, zone: e.target.value }))}
            className="rounded-pitch border-2 border-pitch/30 px-3 py-2 focus-visible:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label htmlFor="incident-description" className="text-sm font-medium text-pitch-dark">
            Description
          </label>
          <textarea
            id="incident-description"
            required
            placeholder="What happened?"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="rounded-pitch border-2 border-pitch/30 px-3 py-2 focus-visible:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="sm:col-span-2 rounded-pitch bg-penalty-red px-4 py-2 font-semibold text-field-white disabled:opacity-60"
        >
          {loading ? 'Submitting…' : 'Submit incident'}
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-2 text-penalty-red">
          {error}
        </p>
      )}
      {data && (
        <p role="status" className="mt-2 text-pitch">
          Incident logged.
        </p>
      )}
    </section>
  );
}