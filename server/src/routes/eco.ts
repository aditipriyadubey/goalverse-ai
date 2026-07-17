import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate.js';
import { aiRateLimiter } from '../middleware/security.js';
import { generateStructured, sanitizePromptInput } from '../services/ai.js';
import { EcoSuggestionSchema } from '../types/schemas.js';
import { mockEcoSuggestion } from '../services/mocks.js';
import { prisma } from '../db/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const ecoRouter = Router();

const TRANSPORT_MODES = ['walk', 'bike', 'metro', 'bus', 'rideshare', 'car'] as const;

const LogSchema = z.object({
  userAlias: z.string().min(1).max(60),
  transportMode: z.enum(TRANSPORT_MODES),
});

ecoRouter.post(
  '/log',
  aiRateLimiter,
  validateBody(LogSchema),
  asyncHandler(async (req, res) => {
    const { userAlias, transportMode } = req.body as z.infer<typeof LogSchema>;
    const safeAlias = sanitizePromptInput(userAlias, 60);

    const prompt = `A fan traveled to the stadium via ${transportMode}.
Respond ONLY with JSON: {"suggestion": string, "co2SavedKg": number, "greenGoalProgress": number (0-100)}.
Estimate CO2 saved versus driving alone, and give one encouraging, gamified suggestion for their next "Green Goal".`;

    const result = await generateStructured({
      prompt,
      schema: EcoSuggestionSchema,
      schemaName: 'eco-suggestion',
      mockFn: () => mockEcoSuggestion(transportMode),
    });

    await prisma.ecoLog.create({
      data: { userAlias: safeAlias, transportMode, co2SavedKg: result.data.co2SavedKg },
    });

    res.status(201).json({ ...result.data, aiSource: result.source });
  }),
);

ecoRouter.get(
  '/summary/:userAlias',
  asyncHandler(async (req, res) => {
    const logs = await prisma.ecoLog.findMany({
      where: { userAlias: req.params.userAlias },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    const totalCo2Saved = logs.reduce((sum, l) => sum + l.co2SavedKg, 0);
    res.json({
      userAlias: req.params.userAlias,
      totalCo2SavedKg: Math.round(totalCo2Saved * 100) / 100,
      tripCount: logs.length,
      logs,
    });
  }),
);