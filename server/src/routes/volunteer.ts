import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate.js';
import { aiRateLimiter } from '../middleware/security.js';
import { generateStructured, sanitizePromptInput } from '../services/ai.js';
import { VolunteerSummarySchema } from '../types/schemas.js';
import { mockVolunteerSummary } from '../services/mocks.js';
import { prisma } from '../db/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const volunteerRouter = Router();

const LostFoundSchema = z.object({
  itemDesc: z.string().min(2).max(200),
  location: z.string().min(1).max(80),
  reportedBy: z.string().min(1).max(80),
});

volunteerRouter.post(
  '/lost-found',
  validateBody(LostFoundSchema),
  asyncHandler(async (req, res) => {
    const data = req.body as z.infer<typeof LostFoundSchema>;
    const report = await prisma.lostFoundReport.create({
      data: {
        itemDesc: sanitizePromptInput(data.itemDesc, 200),
        location: sanitizePromptInput(data.location, 80),
        reportedBy: sanitizePromptInput(data.reportedBy, 80),
      },
    });
    res.status(201).json(report);
  }),
);

volunteerRouter.get(
  '/lost-found',
  asyncHandler(async (_req, res) => {
    const reports = await prisma.lostFoundReport.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
    res.json({ reports });
  }),
);

const IncidentSchema = z.object({
  type: z.enum(['medical', 'crowd', 'security', 'facilities']),
  severity: z.enum(['low', 'medium', 'high']),
  zone: z.string().min(1).max(60),
  description: z.string().min(2).max(300),
});

volunteerRouter.post(
  '/incidents',
  validateBody(IncidentSchema),
  asyncHandler(async (req, res) => {
    const data = req.body as z.infer<typeof IncidentSchema>;
    const incident = await prisma.incidentReport.create({
      data: {
        type: data.type,
        severity: data.severity,
        zone: sanitizePromptInput(data.zone, 60),
        description: sanitizePromptInput(data.description, 300),
      },
    });
    res.status(201).json(incident);
  }),
);

volunteerRouter.get(
  '/summary',
  aiRateLimiter,
  asyncHandler(async (_req, res) => {
    const [openIncidents, lostFoundReports] = await Promise.all([
      prisma.incidentReport.count({ where: { status: 'open' } }),
      prisma.lostFoundReport.count({ where: { status: 'open' } }),
    ]);

    const prompt = `A volunteer dashboard has ${openIncidents} open incident report(s) and ${lostFoundReports} open lost & found report(s).
Respond ONLY with JSON: {"summary": string, "priorityActions": string[], "openIncidents": number}.
Give 2-3 concrete priority actions a volunteer coordinator should take next.`;

    const result = await generateStructured({
      prompt,
      schema: VolunteerSummarySchema,
      schemaName: 'volunteer-summary',
      mockFn: () => mockVolunteerSummary(openIncidents, lostFoundReports),
    });

    res.json({ ...result.data, aiSource: result.source });
  }),
);