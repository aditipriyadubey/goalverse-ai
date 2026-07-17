import 'dotenv/config';
import { createApp } from './app.js';
import { logger } from './utils/logger.js';

const PORT = Number(process.env.PORT) || 4000;

const app = createApp();

app.listen(PORT, () => {
  logger.info(`⚽ GoalVerse AI server listening on http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY) {
    logger.warn('   No GEMINI_API_KEY set — running on local mock AI fallback.');
  }
});