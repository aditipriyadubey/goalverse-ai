import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

const app = createApp();

describe('POST /api/crowd/advice', () => {
  it('recommends an alternate gate for a red-card density', async () => {
    const res = await request(app)
      .post('/api/crowd/advice')
      .send({ gateName: 'Gate 4', density: 0.92 });
    expect(res.status).toBe(200);
    expect(res.body.level).toBe('red');
    expect(res.body.alternateGate).toBeTruthy();
    expect(res.body.estimatedMinutesSaved).toBeGreaterThan(0);
  });

  it('reports flowing well for low density', async () => {
    const res = await request(app)
      .post('/api/crowd/advice')
      .send({ gateName: 'Gate 1', density: 0.1 });
    expect(res.status).toBe(200);
    expect(res.body.level).toBe('green');
    expect(res.body.alternateGate).toBeNull();
  });

  it('rejects density outside 0-1 range', async () => {
    const res = await request(app)
      .post('/api/crowd/advice')
      .send({ gateName: 'Gate 1', density: 1.5 });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/crowd/gates', () => {
  it('returns a list (empty or seeded) without erroring', async () => {
    const res = await request(app).get('/api/crowd/gates');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.gates)).toBe(true);
  });
});
