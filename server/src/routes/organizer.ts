import { Router } from 'express';
import { aiRateLimiter } from '../middleware/security.js';
import { generateStructured } from '../services/ai.js';
import { OrganizerInsightSchema } from '../types/schemas.js';
import { mockOrganizerInsight } from '../services/mocks.js';
import { prisma } from '../db/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const organizerRouter = Router();

organizerRouter.get(
  '/insight',
  aiRateLimiter,
  asyncHandler(async (_req, res) => {
    const [recentReadings, incidentCount] = await Promise.all([
      prisma.crowdReading.findMany({ orderBy: { recordedAt: 'desc' }, take: 20 }),
      prisma.incidentReport.count(),
    ]);
    const peakDensity = recentReadings.length ? Math.max(...recentReadings.map((r) => r.density)) : 0.5;

    const prompt = `You are generating an operational intelligence summary for FIFA World Cup 2026 venue organizers.
Peak observed crowd density today: ${(peakDensity * 100).toFixed(0)}%. Total incidents logged: ${incidentCount}.
Respond ONLY with JSON: {"summary": string, "peakPrediction": string, "staffingSuggestion": string, "trends": string[]}.
Keep it concise and actionable for a venue operations manager.`;

    const result = await generateStructured({
      prompt,
      schema: OrganizerInsightSchema,
      schemaName: 'organizer-insight',
      mockFn: () => mockOrganizerInsight(peakDensity, incidentCount),
    });

    res.json({ ...result.data, aiSource: result.source });
  }),
);

organizerRouter.get(
  '/incidents',
  asyncHandler(async (_req, res) => {
    const incidents = await prisma.incidentReport.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
    res.json({ incidents });
  }),
);