export interface NavigatorResult {
  destination: string;
  summary: string;
  steps: string[];
  estimatedMinutes: number;
  accessibilityNote?: string | null;
  aiSource: 'gemini' | 'mock';
}

export type CrowdLevel = 'green' | 'yellow' | 'orange' | 'red';

export interface GateStatus {
  id: string;
  name: string;
  zone: string;
  capacity: number;
  wheelchairAccessible: boolean;
  density: number;
  level: CrowdLevel;
}

export interface CrowdAdvice {
  headline: string;
  recommendation: string;
  alternateGate: string | null;
  estimatedMinutesSaved: number;
  level: CrowdLevel;
  aiSource: 'gemini' | 'mock';
}

export interface ItineraryPlan {
  id: string;
  title: string;
  timeline: { time: string; activity: string; note?: string }[];
  transportTip: string;
  weatherTip: string;
  aiSource: 'gemini' | 'mock';
}

export interface TranslationResult {
  detectedLanguage: string;
  translatedText: string;
  targetLanguage: string;
  aiSource: 'gemini' | 'mock';
}

export interface AccessibilityRouteResult {
  route: string[];
  facilities: string[];
  summary: string;
  aiSource: 'gemini' | 'mock';
}

export interface EcoSuggestionResult {
  suggestion: string;
  co2SavedKg: number;
  greenGoalProgress: number;
  aiSource: 'gemini' | 'mock';
}

export interface EcoSummaryResult {
  userAlias: string;
  totalCo2SavedKg: number;
  tripCount: number;
  logs: { id: string; transportMode: string; co2SavedKg: number; createdAt: string }[];
}

export interface VolunteerSummaryResult {
  summary: string;
  priorityActions: string[];
  openIncidents: number;
  aiSource: 'gemini' | 'mock';
}

export interface OrganizerInsightResult {
  summary: string;
  peakPrediction: string;
  staffingSuggestion: string;
  trends: string[];
  aiSource: 'gemini' | 'mock';
}

export interface LostFoundReport {
  id: string;
  itemDesc: string;
  location: string;
  status: string;
  reportedBy: string;
  createdAt: string;
}

export interface IncidentReport {
  id: string;
  type: string;
  severity: string;
  zone: string;
  description: string;
  status: string;
  createdAt: string;
}
