import type {
  NavigatorResult,
  GateStatus,
  CrowdAdvice,
  ItineraryPlan,
  TranslationResult,
  AccessibilityRouteResult,
  EcoSuggestionResult,
  EcoSummaryResult,
  VolunteerSummaryResult,
  OrganizerInsightResult,
  LostFoundReport,
  IncidentReport,
} from '../types/api';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}/api${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

  if (!res.ok) {
    let body: { error?: string; details?: unknown } = {};
    try {
      body = await res.json();
    } catch {
      // response had no JSON body — fall through with a generic message
    }
    throw new ApiError(body.error || `Request failed with status ${res.status}`, res.status, body.details);
  }

  return res.json() as Promise<T>;
}

function post<T>(path: string, data: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body: JSON.stringify(data) });
}

export const api = {
  navigator: {
    query: (query: string, fromGate: string) =>
      post<NavigatorResult>('/navigator/query', { query, fromGate }),
  },
  crowd: {
    gates: () => request<{ gates: GateStatus[] }>('/crowd/gates'),
    advice: (gateName: string, density: number) =>
      post<CrowdAdvice>('/crowd/advice', { gateName, density }),
  },
  planner: {
    createItinerary: (input: {
      ownerName: string;
      matchName: string;
      seatSection: string;
      arrivalTime: string;
      companions: number;
      transportMode: string;
    }) => post<ItineraryPlan>('/planner/itinerary', input),
  },
  multilingual: {
    translate: (text: string, targetLang: string) =>
      post<TranslationResult>('/multilingual/translate', { text, targetLang }),
  },
  accessibility: {
    facilities: () => request<{ facilities: unknown[] }>('/accessibility/facilities'),
    route: (need: string) => post<AccessibilityRouteResult>('/accessibility/route', { need }),
  },
  eco: {
    log: (userAlias: string, transportMode: string) =>
      post<EcoSuggestionResult>('/eco/log', { userAlias, transportMode }),
    summary: (userAlias: string) => request<EcoSummaryResult>(`/eco/summary/${encodeURIComponent(userAlias)}`),
  },
  volunteer: {
    summary: () => request<VolunteerSummaryResult>('/volunteer/summary'),
    lostFoundList: () => request<{ reports: LostFoundReport[] }>('/volunteer/lost-found'),
    reportLostFound: (input: { itemDesc: string; location: string; reportedBy: string }) =>
      post<LostFoundReport>('/volunteer/lost-found', input),
    reportIncident: (input: { type: string; severity: string; zone: string; description: string }) =>
      post<IncidentReport>('/volunteer/incidents', input),
  },
  organizer: {
    insight: () => request<OrganizerInsightResult>('/organizer/insight'),
    incidents: () => request<{ incidents: IncidentReport[] }>('/organizer/incidents'),
  },
};
