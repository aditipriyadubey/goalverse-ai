import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { OrganizerInsightResult, IncidentReport } from '../types/api';

export function OrganizerDashboardPage() {
  const [insight, setInsight] = useState<OrganizerInsightResult | null>(null);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.organizer.insight(), api.organizer.incidents()])
      .then(([insightRes, incidentsRes]) => {
        setInsight(insightRes);
        setIncidents(incidentsRes.incidents);
      })
      .catch(() => setError('Could not load the operations dashboard right now.'));
  }, []);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-pitch-dark">Control Room</h1>
        <p className="mt-1 text-pitch-dark/80">Operational intelligence for venue organizers.</p>
      </div>

      {error && (
        <p role="alert" className="rounded-pitch border-2 border-penalty-red bg-penalty-red/10 p-3 text-penalty-red">
          {error}
        </p>
      )}

      {insight && (
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-pitch border-2 border-fifa-blue/30 bg-fifa-blue/5 p-4">
            <h2 className="font-scoreboard text-sm uppercase text-fifa-blue">Summary</h2>
            <p className="mt-1 text-sm text-pitch-dark">{insight.summary}</p>
          </div>
          <div className="rounded-pitch border-2 border-trophy-gold/40 bg-trophy-gold/10 p-4">
            <h2 className="font-scoreboard text-sm uppercase text-trophy-goldDark">Peak prediction</h2>
            <p className="mt-1 text-sm text-pitch-dark">{insight.peakPrediction}</p>
          </div>
          <div className="rounded-pitch border-2 border-pitch/40 bg-pitch/10 p-4">
            <h2 className="font-scoreboard text-sm uppercase text-pitch">Staffing suggestion</h2>
            <p className="mt-1 text-sm text-pitch-dark">{insight.staffingSuggestion}</p>
          </div>
          <div className="rounded-pitch border-2 border-cheer-orange/40 bg-cheer-orange/10 p-4">
            <h2 className="font-scoreboard text-sm uppercase text-cheer-orangeDark">Trends</h2>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-pitch-dark">
              {insight.trends.map((trend, i) => (
                <li key={i}>{trend}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section aria-labelledby="incidents-heading">
        <h2 id="incidents-heading" className="font-scoreboard text-lg uppercase text-fifa-blue">
          Recent incidents
        </h2>
        {incidents.length === 0 ? (
          <p className="mt-2 text-sm text-pitch-dark/70">No incidents logged yet.</p>
        ) : (
          <table className="mt-3 w-full border-collapse text-sm">
            <caption className="sr-only">Recent incident reports</caption>
            <thead>
              <tr className="border-b-2 border-pitch-dark/20 text-left">
                <th scope="col" className="py-2 pr-3">Type</th>
                <th scope="col" className="py-2 pr-3">Severity</th>
                <th scope="col" className="py-2 pr-3">Zone</th>
                <th scope="col" className="py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr key={incident.id} className="border-b border-pitch-dark/10">
                  <td className="py-2 pr-3 capitalize">{incident.type}</td>
                  <td className="py-2 pr-3 capitalize">{incident.severity}</td>
                  <td className="py-2 pr-3">{incident.zone}</td>
                  <td className="py-2">{incident.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}