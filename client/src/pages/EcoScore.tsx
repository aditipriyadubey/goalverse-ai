import { useState } from 'react';
import { api } from '../services/api';
import { useAsyncAction } from '../hooks/useAsyncAction';

const MODES = [
  { value: 'walk', label: 'Walk' },
  { value: 'bike', label: 'Bike' },
  { value: 'metro', label: 'Metro' },
  { value: 'bus', label: 'Bus' },
  { value: 'rideshare', label: 'Rideshare' },
  { value: 'car', label: 'Drove alone' },
];

export function EcoScorePage() {
  const [alias, setAlias] = useState('guest-fan');
  const { data, loading, error, run } = useAsyncAction(api.eco.log);

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-pitch-dark">Eco Score</h1>
      <p className="mt-1 text-pitch-dark/80">Log how you got to the match and chase your next Green Goal.</p>

      <div className="mt-4">
        <label htmlFor="alias" className="block text-sm font-semibold text-pitch-dark">
          Your fan alias
        </label>
        <input
          id="alias"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          className="mt-1 w-full max-w-xs rounded-pitch border-2 border-pitch/30 px-3 py-2 focus-visible:outline-none"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {MODES.map((mode) => (
          <button
            key={mode.value}
            type="button"
            disabled={loading || alias.trim().length === 0}
            onClick={() => run(alias, mode.value)}
            className="rounded-pitch border-2 border-pitch/30 bg-pitch/5 px-4 py-2 font-semibold text-pitch-dark hover:bg-pitch/10 disabled:opacity-60"
          >
            {mode.label}
          </button>
        ))}
      </div>

      <div aria-live="polite" className="mt-6">
        {error && (
          <p role="alert" className="rounded-pitch border-2 border-penalty-red bg-penalty-red/10 p-3 text-penalty-red">
            {error}
          </p>
        )}
        {data && (
          <div className="rounded-pitch border-2 border-pitch bg-pitch/5 p-4">
            <p className="font-scoreboard text-lg text-pitch-dark">{data.co2SavedKg} kg CO₂ saved</p>
            <div
              className="mt-2 h-3 w-full overflow-hidden rounded-full bg-pitch-dark/10"
              role="progressbar"
              aria-valuenow={data.greenGoalProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Green Goal progress"
            >
              <div className="h-full bg-pitch" style={{ width: `${data.greenGoalProgress}%` }} />
            </div>
            <p className="mt-2 text-sm text-pitch-dark/80">{data.suggestion}</p>
          </div>
        )}
      </div>
    </div>
  );
}
