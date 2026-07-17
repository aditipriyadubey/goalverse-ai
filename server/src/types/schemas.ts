import { z } from 'zod';

export const NavigatorResponseSchema = z.object({
  destination: z.string(),
  summary: z.string(),
  steps: z.array(z.string()).min(1),
  estimatedMinutes: z.number().nonnegative(),
  accessibilityNote: z.string().optional(),
});
export type NavigatorResponse = z.infer<typeof NavigatorResponseSchema>;

export const CrowdAdviceSchema = z.object({
  headline: z.string(),
  recommendation: z.string(),
  alternateGate: z.string().nullable(),
  estimatedMinutesSaved: z.number().nonnegative(),
});
export type CrowdAdvice = z.infer<typeof CrowdAdviceSchema>;

export const ItineraryPlanSchema = z.object({
  title: z.string(),
  timeline: z.array(
    z.object({
      time: z.string(),
      activity: z.string(),
      note: z.string().optional(),
    }),
  ).min(1),
  transportTip: z.string(),
  weatherTip: z.string(),
});
export type ItineraryPlan = z.infer<typeof ItineraryPlanSchema>;

export const TranslationResponseSchema = z.object({
  detectedLanguage: z.string(),
  translatedText: z.string(),
  targetLanguage: z.string(),
});
export type TranslationResponse = z.infer<typeof TranslationResponseSchema>;

export const AccessibilityRouteSchema = z.object({
  route: z.array(z.string()).min(1),
  facilities: z.array(z.string()),
  summary: z.string(),
});
export type AccessibilityRoute = z.infer<typeof AccessibilityRouteSchema>;

export const EcoSuggestionSchema = z.object({
  suggestion: z.string(),
  co2SavedKg: z.number().nonnegative(),
  greenGoalProgress: z.number().min(0).max(100),
});
export type EcoSuggestion = z.infer<typeof EcoSuggestionSchema>;

export const VolunteerSummarySchema = z.object({
  summary: z.string(),
  priorityActions: z.array(z.string()),
  openIncidents: z.number().nonnegative(),
});
export type VolunteerSummary = z.infer<typeof VolunteerSummarySchema>;

export const OrganizerInsightSchema = z.object({
  summary: z.string(),
  peakPrediction: z.string(),
  staffingSuggestion: z.string(),
  trends: z.array(z.string()),
});
export type OrganizerInsight = z.infer<typeof OrganizerInsightSchema>;
