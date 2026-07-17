import express from 'express';
import { helmetMiddleware, corsMiddleware, apiRateLimiter } from './middleware/security.js';
import { errorHandler, notFoundHandler } from './middleware/validate.js';
import { navigatorRouter } from './routes/navigator.js';
import { crowdRouter } from './routes/crowd.js';
import { plannerRouter } from './routes/planner.js';
import { multilingualRouter } from './routes/multilingual.js';
import { accessibilityRouter } from './routes/accessibility.js';
import { ecoRouter } from './routes/eco.js';
import { volunteerRouter } from './routes/volunteer.js';
import { organizerRouter } from './routes/organizer.js';

/**
 * Building the app as a factory function (rather than calling .listen()
 * directly here) lets tests import it and hit it with supertest without
 * binding a real network port.
 */
export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmetMiddleware);
  app.use(corsMiddleware);
  app.use(express.json({ limit: '50kb' })); // small limit: this API has no file uploads
  app.use(apiRateLimiter);

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'goalverse-ai-server', time: new Date().toISOString() });
  });

  app.use('/api/navigator', navigatorRouter);
  app.use('/api/crowd', crowdRouter);
  app.use('/api/planner', plannerRouter);
  app.use('/api/multilingual', multilingualRouter);
  app.use('/api/accessibility', accessibilityRouter);
  app.use('/api/eco', ecoRouter);
  app.use('/api/volunteer', volunteerRouter);
  app.use('/api/organizer', organizerRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
