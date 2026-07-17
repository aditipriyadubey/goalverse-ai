import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate.js';
import { aiRateLimiter } from '../middleware/security.js';
import { generateStructured, sanitizePromptInput } from '../services/ai.js';
import { CrowdAdviceSchema } from '../types/schemas.js';
import { mockCrowdAdvice } from '../services/mocks.js';
import { prisma } from '../db/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const crowdRouter = Router();

function levelFromDensity(density: number): 'green' | 'yellow' | 'orange' | 'red' {
  if (density > 0.85) return 'red';
  if (density > 0.65) return 'orange';
  if (density > 0.4) return 'yellow';
  return 'green';
}

/** Live-simulated crowd density per gate (deterministic per-minute pseudo-randomness). */
crowdRouter.get(
  '/gates',
  asyncHandler(async (_req, res) => {
    const gates = await prisma.gate.findMany({ orderBy: { name: 'asc' } });
    const minuteSeed = Math.floor(Date.now() / 30_000); // shifts every 30s for a "live" feel

    const data = gates.map((gate, idx) => {
      const pseudoRandom = Math.abs(Math.sin(minuteSeed * (idx + 1) * 0.7));
      const density = Math.round(pseudoRandom * 100) / 100;
      return {
        id: gate.id,
        name: gate.name,
        zone: gate.zone,
        capacity: gate.capacity,
        wheelchairAccessible: gate.wheelchairAccessible,
        density,
        level: levelFromDensity(density),
      };
    });

    res.json({ gates: data });
  }),
);

const AdviceSchema = z.object({
  gateName: z.string().min(1).max(60),
  density: z.number().min(0).max(1),
});

crowdRouter.post(
  '/advice',
  aiRateLimiter,
  validateBody(AdviceSchema),
  asyncHandler(async (req, res) => {
    const { gateName, density } = req.body as z.infer<typeof AdviceSchema>;
    const safeGate = sanitizePromptInput(gateName, 60);
    const level = levelFromDensity(density);

    const prompt = `You are a football-coach-style stadium crowd assistant.
Gate "${safeGate}" currently has crowd density ${(density * 100).toFixed(0)}% (card level: ${level}).
Respond ONLY with JSON: {"headline": string, "recommendation": string, "alternateGate": string | null, "estimatedMinutesSaved": number}.
Use an encouraging, football-coach tone (e.g. "Switch to Gate 2, you'll save 18 minutes"). If density is under 40%, say the gate is flowing well and set alternateGate to null.`;

    const result = await generateStructured({
      prompt,
      schema: CrowdAdviceSchema,
      schemaName: 'crowd-advice',
      mockFn: () => mockCrowdAdvice(safeGate, density),
    });

    res.json({ ...result.data, level, aiSource: result.source });
  }),
);