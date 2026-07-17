import type { NextFunction, Request, Response, RequestHandler, ErrorRequestHandler } from 'express';
import type { z } from 'zod';
import { logger } from '../utils/logger.js';

/** Validates req.body against a zod schema; sends 400 with details on failure. */
export function validateBody<T extends z.ZodTypeAny>(schema: T): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: 'Invalid request body',
        details: result.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      });
      return;
    }
    req.body = result.data;
    next();
  };
}

/** Validates req.query against a zod schema; sends 400 with details on failure. */
export function validateQuery<T extends z.ZodTypeAny>(schema: T): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({
        error: 'Invalid query parameters',
        details: result.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      });
      return;
    }
    // Store parsed query separately; Express 4 makes req.query read-only in some setups.
    (req as Request & { validatedQuery?: unknown }).validatedQuery = result.data;
    next();
  };
}

/**
 * Centralized error handler. Never leaks stack traces or internal error
 * messages to the client — logs details server-side only.
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  logger.error('[unhandled-error]', err);
  res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
};

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
};