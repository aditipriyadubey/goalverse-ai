import { useState, type FormEvent } from 'react';
import { api } from '../services/api';
import { useAsyncAction } from '../hooks/useAsyncAction';

/** Self-contained lost &amp; found reporting form for the volunteer desk. */
export function LostFoundForm() {
  const [form, setForm] = useState({ itemDesc: '', location: '', reportedBy: '' });
  const { data, loading, error, run } = useAsyncAction(api.volunteer.reportLostFound);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    run(form).then((result) => {
      if (result) setForm({ itemDesc: '', location: '', reportedBy: '' });
    });
  }

  return (
    <section aria-labelledby="lostfound-heading">
      <h2 id="lostfound-heading" className="font-scoreboard text-lg uppercase text-fifa-blue">
        Report lost &amp; found
      </h2>
      <form onSubmit={handleSubmit} className="mt-3 grid gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="lf-item-desc" className="text-sm font-medium text-pitch-dark">
            Item description
          </label>
          <input
            id="lf-item-desc"
            required
            placeholder="Item description"
            value={form.itemDesc}
            onChange={(e) => setForm((f) => ({ ...f, itemDesc: e.target.value }))}
            className="rounded-pitch border-2 border-pitch/30 px-3 py-2 focus-visible:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="lf-location" className="text-sm font-medium text-pitch-dark">
            Location
          </label>
          <input
            id="lf-location"
            required
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            className="rounded-pitch border-2 border-pitch/30 px-3 py-2 focus-visible:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="lf-reported-by" className="text-sm font-medium text-pitch-dark">
            Reported by
          </label>
          <input
            id="lf-reported-by"
            required
            placeholder="Reported by"
            value={form.reportedBy}
            onChange={(e) => setForm((f) => ({ ...f, reportedBy: e.target.value }))}
            className="rounded-pitch border-2 border-pitch/30 px-3 py-2 focus-visible:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="sm:col-span-3 rounded-pitch bg-cheer-orangeDark px-4 py-2 font-semibold text-field-white disabled:opacity-60"
        >
          {loading ? 'Submitting…' : 'Submit report'}
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-2 text-penalty-red">
          {error}
        </p>
      )}
      {data && (
        <p role="status" className="mt-2 text-pitch">
          Report logged.
        </p>
      )}
    </section>
  );
}