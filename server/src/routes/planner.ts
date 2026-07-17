import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate.js';
import { aiRateLimiter } from '../middleware/security.js';
import { generateStructured, sanitizePromptInput } from '../services/ai.js';
import { ItineraryPlanSchema } from '../types/schemas.js';
import { mockItinerary } from '../services/mocks.js';
import { prisma } from '../db/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const plannerRouter = Router();

const PlanSchema = z.object({
  ownerName: z.string().min(1).max(80),
  matchName: z.string().min(1).max(120),
  seatSection: z.string().min(1).max(60),
  arrivalTime: z.string().datetime().or(z.string().min(1).max(40)),
  companions: z.coerce.number().int().min(1).max(20).default(1),
  transportMode: z.enum(['walk', 'metro', 'bus', 'rideshare', 'bike', 'car']),
});

plannerRouter.post(
  '/itinerary',
  aiRateLimiter,
  validateBody(PlanSchema),
  asyncHandler(async (req, res) => {
    const input = req.body as z.infer<typeof PlanSchema>;
    const safeMatch = sanitizePromptInput(input.matchName, 120);
    const safeSection = sanitizePromptInput(input.seatSection, 60);

    const prompt = `Create a match-day itinerary for a FIFA World Cup 2026 fan.
Match: ${safeMatch}. Seat section: ${safeSection}. Companions: ${input.companions}. Transport: ${input.transportMode}. Arrival target: ${input.arrivalTime}.
Respond ONLY with JSON: {"title": string, "timeline": [{"time": string, "activity": string, "note": string}], "transportTip": string, "weatherTip": string}.
Timeline should have 4-6 entries relative to kickoff (e.g. "-02:00", "00:00", "+02:15").`;

    const result = await generateStructured({
      prompt,
      schema: ItineraryPlanSchema,
      schemaName: 'itinerary',
      mockFn: () =>
        mockItinerary({
          matchName: safeMatch,
          seatSection: safeSection,
          transportMode: input.transportMode,
          companions: input.companions,
        }),
      useCache: false, // itineraries are personalized enough to skip caching
    });

    const saved = await prisma.itinerary.create({
      data: {
        ownerName: sanitizePromptInput(input.ownerName, 80),
        matchName: safeMatch,
        seatSection: safeSection,
        arrivalTime: new Date(),
        companions: input.companions,
        transportMode: input.transportMode,
        planJson: JSON.stringify(result.data),
      },
    });

    res.status(201).json({ id: saved.id, ...result.data, aiSource: result.source });
  }),
);

plannerRouter.get(
  '/itinerary/:id',
  asyncHandler(async (req, res) => {
    const itinerary = await prisma.itinerary.findUnique({ where: { id: req.params.id } });
    if (!itinerary) {
      res.status(404).json({ error: 'Itinerary not found' });
      return;
    }
    res.json({ ...itinerary, plan: JSON.parse(itinerary.planJson) });
  }),
);