import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate.js';
import { aiRateLimiter } from '../middleware/security.js';
import { generateStructured, sanitizePromptInput } from '../services/ai.js';
import { AccessibilityRouteSchema } from '../types/schemas.js';
import { mockAccessibilityRoute } from '../services/mocks.js';
import { prisma } from '../db/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const accessibilityRouter = Router();

accessibilityRouter.get(
  '/facilities',
  asyncHandler(async (_req, res) => {
    const facilities = await prisma.pointOfInterest.findMany({
      where: {
        category: { in: ['quiet_zone', 'medical', 'family_zone', 'washroom'] },
      },
      orderBy: { name: 'asc' },
    });
    res.json({ facilities });
  }),
);

const NeedSchema = z.object({
  need: z.string().min(2).max(200),
});

accessibilityRouter.post(
  '/route',
  aiRateLimiter,
  validateBody(NeedSchema),
  asyncHandler(async (req, res) => {
    const { need } = req.body as z.infer<typeof NeedSchema>;
    const safeNeed = sanitizePromptInput(need, 200);

    const prompt = `A stadium visitor has this accessibility need: "${safeNeed}".
Respond ONLY with JSON: {"route": string[], "facilities": string[], "summary": string}.
The route should be a step-free, wheelchair-friendly path with 3-5 steps. Facilities should list nearby relevant amenities (accessible washroom, quiet zone, medical station, wheelchair charging point, etc), only ones relevant to the need.`;

    const result = await generateStructured({
      prompt,
      schema: AccessibilityRouteSchema,
      schemaName: 'accessibility-route',
      mockFn: () => mockAccessibilityRoute(safeNeed),
    });

    res.json({ ...result.data, aiSource: result.source });
  }),
);