import type {
  NavigatorResponse,
  CrowdAdvice,
  ItineraryPlan,
  TranslationResponse,
  AccessibilityRoute,
  EcoSuggestion,
  VolunteerSummary,
  OrganizerInsight,
} from '../types/schemas.js';

/**
 * These mocks are not "fake AI" dressed up — they are honest, rule-based
 * fallbacks that keep every feature functional without a paid API key.
 * They are intentionally simple and readable rather than trying to imitate
 * Gemini's fluency.
 */

export function mockNavigator(query: string, fromGate: string): NavigatorResponse {
  const q = query.toLowerCase();
  let destination = 'General Concourse';
  let note: string | undefined;

  if (q.includes('wheelchair') || q.includes('accessible')) {
    destination = 'Accessible Seating Ramp B';
    note = 'Step-free route with tactile paving the entire way.';
  } else if (q.includes('washroom') || q.includes('restroom') || q.includes('toilet')) {
    destination = 'Washroom Block C';
  } else if (q.includes('halal')) {
    destination = 'Halal Food Court (East Concourse)';
  } else if (q.includes('merch')) {
    destination = 'Official Merchandise Store';
  } else if (q.includes('seat')) {
    destination = 'Your seat block';
  } else if (q.includes('medical')) {
    destination = 'Medical Station 2';
  }

  return {
    destination,
    summary: `From ${fromGate}, the fastest path to ${destination} avoids the main concourse crowd.`,
    steps: [
      `Exit ${fromGate} and turn toward the concourse ring`,
      'Follow the green pitch-marking floor decals',
      `Arrive at ${destination}`,
    ],
    estimatedMinutes: 6,
    accessibilityNote: note,
  };
}

export function mockCrowdAdvice(gateName: string, density: number): CrowdAdvice {
  const level = density > 0.85 ? 'red' : density > 0.65 ? 'orange' : density > 0.4 ? 'yellow' : 'green';
  const overloaded = level === 'red' || level === 'orange';
  return {
    headline: overloaded ? `${gateName} is overloaded (${level} card)` : `${gateName} is flowing well`,
    recommendation: overloaded
      ? `Switch to the nearest open gate to avoid the crowd build-up at ${gateName}.`
      : `${gateName} is a good route right now — no changes needed.`,
    alternateGate: overloaded ? 'Gate 2' : null,
    estimatedMinutesSaved: overloaded ? Math.round(density * 20) : 0,
  };
}

export function mockItinerary(input: {
  matchName: string;
  seatSection: string;
  transportMode: string;
  companions: number;
}): ItineraryPlan {
  return {
    title: `Match Day Plan: ${input.matchName}`,
    timeline: [
      { time: '-02:30', activity: `Depart via ${input.transportMode}`, note: 'Buffer for security lines' },
      { time: '-01:00', activity: 'Arrive at stadium, clear security & bag check' },
      { time: '-00:30', activity: `Head to ${input.seatSection}`, note: `Party of ${input.companions}` },
      { time: '00:00', activity: 'Kickoff' },
      { time: '+02:15', activity: 'Post-match exit via least-crowded gate' },
    ],
    transportTip:
      input.transportMode === 'metro'
        ? 'Metro platforms get congested for 45 min post-match — consider a short concourse break.'
        : 'Pre-book parking or rideshare pickup to avoid post-match queueing.',
    weatherTip: 'Check the forecast the morning of the match and dress in layers.',
  };
}

const SUPPORTED_LANGS: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  es: 'Spanish',
  fr: 'French',
  pt: 'Portuguese',
  ar: 'Arabic',
};

export function mockTranslate(text: string, targetLang: string): TranslationResponse {
  const target = SUPPORTED_LANGS[targetLang] ? targetLang : 'en';
  return {
    detectedLanguage: 'en',
    // Honest mock: we do not attempt real translation without an AI key.
    translatedText:
    "Looks like GoalVerse AI has been getting a lot of love! ⚽💙\n\n" +
    "AditiPriya's free Gemini API quota has been exhausted for today due to heavy usage.\n\n" +
    "Thank you for exploring the project.\nPlease try again after the quota resets. 🚀",
    targetLanguage: target,
  };
}

export function mockAccessibilityRoute(need: string): AccessibilityRoute {
  return {
    route: ['Main Gate', 'Step-free ramp', 'Accessible concourse', 'Designated seating'],
    facilities: ['Wheelchair charging point', 'Quiet zone nearby', 'Accessible washroom'],
    summary: `Step-free route generated for: ${need}`,
  };
}

export function mockEcoSuggestion(transportMode: string): EcoSuggestion {
  const savings: Record<string, number> = {
    walk: 2.1,
    bike: 1.8,
    metro: 1.5,
    bus: 1.2,
    rideshare: 0.3,
    car: 0,
  };
  const co2SavedKg = savings[transportMode] ?? 0.5;
  return {
    suggestion:
      co2SavedKg > 1
        ? `Great choice — ${transportMode} is one of the greenest ways to reach the stadium.`
        : 'Consider metro or bike-share for your next match to boost your Green Goal.',
    co2SavedKg,
    greenGoalProgress: Math.min(100, Math.round(co2SavedKg * 40)),
  };
}

export function mockVolunteerSummary(openIncidents: number, lostFoundCount: number): VolunteerSummary {
  return {
    summary: `${openIncidents} open incident(s) and ${lostFoundCount} active lost & found report(s) across the venue.`,
    priorityActions:
      openIncidents > 3
        ? ['Escalate high-severity incidents to control room', 'Redeploy floaters to North concourse']
        : ['Continue routine patrols', 'Monitor Gate 4 density'],
    openIncidents,
  };
}

export function mockOrganizerInsight(peakDensity: number, incidentCount: number): OrganizerInsight {
  return {
    summary: `Peak crowd density observed at ${Math.round(peakDensity * 100)}%. ${incidentCount} incidents logged today.`,
    peakPrediction: 'Expect peak congestion 45 minutes before kickoff and 20 minutes after full-time.',
    staffingSuggestion:
      peakDensity > 0.75
        ? 'Add 2 additional stewards to North and East gates for the next fixture.'
        : 'Current staffing levels are adequate for observed demand.',
    trends: ['Gate 4 consistently trends busier than Gate 2', 'Medical requests peak at half-time'],
  };
}
