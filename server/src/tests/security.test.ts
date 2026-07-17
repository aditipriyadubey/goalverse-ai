import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

/**
 * The AI rate limiter (server/src/middleware/security.ts) is configured for
 * 20 requests/minute. This test proves the limiter actually engages under
 * load rather than just existing as unused middleware wiring.
 */
describe('AI rate limiting', () => {
  it('returns 429 after exceeding the AI endpoint limit', async () => {
    const app = createApp();
    const AI_LIMIT = 20;
    let sawRateLimited = false;

    for (let i = 0; i < AI_LIMIT + 5; i++) {
      // eslint-disable-next-line no-await-in-loop
      const res = await request(app)
        .post('/api/navigator/query')
        .send({ query: 'Nearest washroom', fromGate: 'Gate 1' });
      if (res.status === 429) {
        sawRateLimited = true;
        expect(res.body.error).toMatch(/limit/i);
        break;
      }
    }

    expect(sawRateLimited).toBe(true);
  });
});