import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

const app = createApp();

describe('POST /api/eco/log', () => {
  it('logs a green trip and returns CO2 saved estimate', async () => {
    const res = await request(app)
      .post('/api/eco/log')
      .send({ userAlias: 'test-fan-1', transportMode: 'bike' });
    expect(res.status).toBe(201);
    expect(res.body.co2SavedKg).toBeGreaterThanOrEqual(0);
    expect(res.body.greenGoalProgress).toBeGreaterThanOrEqual(0);
    expect(res.body.greenGoalProgress).toBeLessThanOrEqual(100);
  });

  it('rejects an unsupported transport mode', async () => {
    const res = await request(app)
      .post('/api/eco/log')
      .send({ userAlias: 'test-fan-2', transportMode: 'helicopter' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/eco/summary/:userAlias', () => {
  it('returns aggregate totals after logging a trip', async () => {
    const alias = 'test-fan-summary';
    await request(app).post('/api/eco/log').send({ userAlias: alias, transportMode: 'metro' });
    const res = await request(app).get(`/api/eco/summary/${alias}`);
    expect(res.status).toBe(200);
    expect(res.body.tripCount).toBeGreaterThanOrEqual(1);
    expect(res.body.totalCo2SavedKg).toBeGreaterThanOrEqual(0);
  });
});
