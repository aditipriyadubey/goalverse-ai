import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

const app = createApp();

describe('POST /api/accessibility/route', () => {
  it('generates a step-free route for a mobility need', async () => {
    const res = await request(app)
      .post('/api/accessibility/route')
      .send({ need: 'I use a wheelchair and need the shortest step-free route to Section 114' });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.route)).toBe(true);
    expect(res.body.route.length).toBeGreaterThan(0);
    expect(Array.isArray(res.body.facilities)).toBe(true);
  });

  it('rejects an empty need', async () => {
    const res = await request(app).post('/api/accessibility/route').send({ need: '' });
    expect(res.status).toBe(400);
  });
});
