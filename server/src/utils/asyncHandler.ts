import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Wraps an async Express handler so a thrown/rejected error is forwarded to
 * the centralized error handler automatically. Removes the repeated
 * `try { ... } catch (err) { next(err) }` boilerplate that was previously
 * duplicated in every route file.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}