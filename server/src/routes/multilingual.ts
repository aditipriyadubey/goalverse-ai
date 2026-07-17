import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate.js';
import { aiRateLimiter } from '../middleware/security.js';
import { generateStructured, sanitizePromptInput } from '../services/ai.js';
import { TranslationResponseSchema } from '../types/schemas.js';
import { mockTranslate } from '../services/mocks.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const multilingualRouter = Router();

const SUPPORTED = ['en', 'hi', 'es', 'fr', 'pt', 'ar'] as const;

const TranslateSchema = z.object({
  text: z.string().min(1).max(500),
  targetLang: z.enum(SUPPORTED),
});

multilingualRouter.post(
  '/translate',
  aiRateLimiter,
  validateBody(TranslateSchema),
  asyncHandler(async (req, res) => {
    const { text, targetLang } = req.body as z.infer<typeof TranslateSchema>;
    const safeText = sanitizePromptInput(text, 500);

    const prompt = `Detect the language of this text and translate it to ${targetLang} (ISO code).
Text: "${safeText}"
Respond ONLY with JSON: {"detectedLanguage": string, "translatedText": string, "targetLanguage": string}.`;

    const result = await generateStructured({
      prompt,
      schema: TranslationResponseSchema,
      schemaName: 'translate',
      mockFn: () => mockTranslate(safeText, targetLang),
    });

    res.json({ ...result.data, aiSource: result.source });
  }),
);

multilingualRouter.get('/languages', (_req, res) => {
  res.json({
    supported: [
      { code: 'en', label: 'English' },
      { code: 'hi', label: 'हिन्दी' },
      { code: 'es', label: 'Español' },
      { code: 'fr', label: 'Français' },
      { code: 'pt', label: 'Português' },
      { code: 'ar', label: 'العربية' },
    ],
  });
});