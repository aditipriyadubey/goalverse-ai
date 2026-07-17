import { useState, type FormEvent } from 'react';
import { api } from '../services/api';
import { useAsyncAction } from '../hooks/useAsyncAction';

const TRANSPORT_MODES = ['walk', 'metro', 'bus', 'rideshare', 'bike', 'car'] as const;

export function MatchPlannerPage() {
  const [form, setForm] = useState({
    ownerName: '',
    matchName: '',
    seatSection: '',
    arrivalTime: '',
    companions: 1,
    transportMode: 'metro' as (typeof TRANSPORT_MODES)[number],
  });
  const { data, loading, error, run } = useAsyncAction(api.planner.createItinerary);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    run({ ...form, arrivalTime: form.arrivalTime || new Date().toISOString() });
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-pitch-dark">Match Day Planner</h1>
      <p className="mt-1 text-pitch-dark/80">A personalized timeline from your door to your seat and back.</p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2" aria-label="Match day plan request">
        <div className="sm:col-span-2">
          <label htmlFor="matchName" className="block text-sm font-semibold text-pitch-dark">
            Match
          </label>
          <input
            id="matchName"
            required
            value={form.matchName}
            onChange={(e) => setForm((f) => ({ ...f, matchName: e.target.value }))}
            placeholder="e.g. Group Stage: Brazil vs Argentina"
            className="mt-1 w-full rounded-pitch border-2 border-pitch/30 px-3 py-2 focus-visible:outline-none"
          />
        </div>
        <div>
          <label htmlFor="ownerName" className="block text-sm font-semibold text-pitch-dark">
            Your name
          </label>
          <input
            id="ownerName"
            required
            value={form.ownerName}
            onChange={(e) => setForm((f) => ({ ...f, ownerName: e.target.value }))}
            className="mt-1 w-full rounded-pitch border-2 border-pitch/30 px-3 py-2 focus-visible:outline-none"
          />
        </div>
        <div>
          <label htmlFor="seatSection" className="block text-sm font-semibold text-pitch-dark">
            Seat section
          </label>
          <input
            id="seatSection"
            required
            value={form.seatSection}
            onChange={(e) => setForm((f) => ({ ...f, seatSection: e.target.value }))}
            placeholder="e.g. Section 114, Row F"
            className="mt-1 w-full rounded-pitch border-2 border-pitch/30 px-3 py-2 focus-visible:outline-none"
          />
        </div>
        <div>
          <label htmlFor="companions" className="block text-sm font-semibold text-pitch-dark">
            Party size
          </label>
          <input
            id="companions"
            type="number"
            min={1}
            max={20}
            value={form.companions}
            onChange={(e) => setForm((f) => ({ ...f, companions: Number(e.target.value) }))}
            className="mt-1 w-full rounded-pitch border-2 border-pitch/30 px-3 py-2 focus-visible:outline-none"
          />
        </div>
        <div>
          <label htmlFor="transportMode" className="block text-sm font-semibold text-pitch-dark">
            Transport
          </label>
          <select
            id="transportMode"
            value={form.transportMode}
            onChange={(e) => setForm((f) => ({ ...f, transportMode: e.target.value as typeof f.transportMode }))}
            className="mt-1 w-full rounded-pitch border-2 border-pitch/30 px-3 py-2 focus-visible:outline-none"
          >
            {TRANSPORT_MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-pitch bg-cheer-orangeDark px-5 py-2 font-semibold text-field-white shadow disabled:opacity-60"
          >
            {loading ? 'Building your plan…' : 'Build my match-day plan'}
          </button>
        </div>
      </form>

      <div aria-live="polite" className="mt-6">
        {error && (
          <p role="alert" className="rounded-pitch border-2 border-penalty-red bg-penalty-red/10 p-3 text-penalty-red">
            {error}
          </p>
        )}
        {data && (
          <div className="rounded-pitch border-2 border-pitch bg-pitch/5 p-4">
            <p className="font-scoreboard text-lg text-pitch-dark">{data.title}</p>
            <ul className="mt-3 space-y-2">
              {data.timeline.map((entry, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="w-16 shrink-0 font-mono font-semibold text-fifa-blue">{entry.time}</span>
                  <span>
                    {entry.activity}
                    {entry.note && <span className="block text-pitch-dark/60">{entry.note}</span>}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-pitch-dark/80"><span className="font-semibold">Transport:</span> {data.transportTip}</p>
            <p className="mt-1 text-sm text-pitch-dark/80"><span className="font-semibold">Weather:</span> {data.weatherTip}</p>
          </div>
        )}
      </div>
    </div>
  );
}