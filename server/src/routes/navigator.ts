import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate.js';
import { aiRateLimiter } from '../middleware/security.js';
import { generateStructured, sanitizePromptInput } from '../services/ai.js';
import { NavigatorResponseSchema } from '../types/schemas.js';
import { mockNavigator } from '../services/mocks.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const navigatorRouter = Router();

const QuerySchema = z.object({
  query: z.string().min(2).max(300),
  fromGate: z.string().min(1).max(60).default('Gate 1'),
});

navigatorRouter.post(
  '/query',
  aiRateLimiter,
  validateBody(QuerySchema),
  asyncHandler(async (req, res) => {
    const { query, fromGate } = req.body as z.infer<typeof QuerySchema>;
    const safeQuery = sanitizePromptInput(query);
    const safeGate = sanitizePromptInput(fromGate, 60);

    const prompt = `You are a stadium navigation assistant for a FIFA World Cup 2026 venue.
A fan starting at "${safeGate}" asks: "${safeQuery}".
Respond ONLY with JSON matching this shape:
{"destination": string, "summary": string, "steps": string[], "estimatedMinutes": number, "accessibilityNote": string | null}
Keep steps to 3-5 short, concrete walking directions. If the request mentions accessibility, wheelchair access, or mobility needs, include a helpful accessibilityNote; otherwise omit it.`;

    const result = await generateStructured({
      prompt,
      schema: NavigatorResponseSchema,
      schemaName: 'navigator',
      mockFn: () => mockNavigator(safeQuery, safeGate),
    });

    res.json({ ...result.data, aiSource: result.source });
  }),
);