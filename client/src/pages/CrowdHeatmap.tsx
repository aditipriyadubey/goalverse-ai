import { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import { MatchCard } from '../components/MatchCard';
import type { GateStatus, CrowdAdvice } from '../types/api';

export function CrowdHeatmapPage() {
  const [gates, setGates] = useState<GateStatus[]>([]);
  const [advice, setAdvice] = useState<Record<string, CrowdAdvice>>({});
  const [loadingGates, setLoadingGates] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadGates = useCallback(async () => {
    setLoadingGates(true);
    try {
      const res = await api.crowd.gates();
      setGates(res.gates);
      setFetchError(null);
    } catch {
      setFetchError('Could not load live gate data. Showing the last known state, if any.');
    } finally {
      setLoadingGates(false);
    }
  }, []);

  useEffect(() => {
    loadGates();
    // Refresh every 30s to feel "live" without hammering the API.
    const interval = setInterval(loadGates, 30_000);
    return () => clearInterval(interval);
  }, [loadGates]);

  async function getAdvice(gate: GateStatus) {
    try {
      const result = await api.crowd.advice(gate.name, gate.density);
      setAdvice((prev) => ({ ...prev, [gate.id]: result }));
    } catch {
      setFetchError('Could not fetch advice for that gate right now.');
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-pitch-dark">Crowd Watch</h1>
      <p className="mt-1 text-pitch-dark/80">
        Live gate density, shown the way a referee would call it — green, yellow, orange, or red.
      </p>

      {fetchError && (
        <p role="alert" className="mt-4 rounded-pitch border-2 border-penalty-red bg-penalty-red/10 p-3 text-penalty-red">
          {fetchError}
        </p>
      )}

      {loadingGates && gates.length === 0 && (
        <p role="status" className="mt-6 text-pitch-dark/70">
          Reading the crowd…
        </p>
      )}

      {!loadingGates && gates.length === 0 && !fetchError && (
        <p className="mt-6 text-pitch-dark/70">
          No gate data yet — run <code>npm run db:seed</code> in the server workspace to populate sample gates.
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gates.map((gate) => (
          <div key={gate.id}>
            <MatchCard level={gate.level} title={`${gate.name} · ${Math.round(gate.density * 100)}%`}>
              <p className="mt-1 text-xs">{gate.zone} zone{gate.wheelchairAccessible ? ' · ♿ accessible' : ''}</p>
              <button
                type="button"
                onClick={() => getAdvice(gate)}
                className="mt-3 rounded-pitch border border-current px-3 py-1 text-xs font-semibold"
              >
                Get coach's advice
              </button>
              {advice[gate.id] && (
                <p className="mt-2 text-sm">
                  {advice[gate.id].recommendation}
                  {advice[gate.id].alternateGate &&
                    ` (≈${advice[gate.id].estimatedMinutesSaved} min saved via ${advice[gate.id].alternateGate})`}
                </p>
              )}
            </MatchCard>
          </div>
        ))}
      </div>
    </div>
  );
}
