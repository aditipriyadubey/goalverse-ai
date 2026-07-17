import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

const app = createApp();

describe('POST /api/navigator/query', () => {
  it('returns a navigation plan for a valid query', async () => {
    const res = await request(app)
      .post('/api/navigator/query')
      .send({ query: 'Nearest washroom please', fromGate: 'Gate 6' });
    expect(res.status).toBe(200);
    expect(res.body.destination).toBeTypeOf('string');
    expect(Array.isArray(res.body.steps)).toBe(true);
    expect(res.body.steps.length).toBeGreaterThan(0);
    expect(res.body.estimatedMinutes).toBeGreaterThanOrEqual(0);
  });

  it('includes an accessibility note for wheelchair-related queries', async () => {
    const res = await request(app)
      .post('/api/navigator/query')
      .send({ query: 'I need wheelchair access to my seat', fromGate: 'Gate 3' });
    expect(res.status).toBe(200);
    expect(res.body.accessibilityNote).toBeTruthy();
  });

  it('rejects a too-short query', async () => {
    const res = await request(app).post('/api/navigator/query').send({ query: 'a' });
    expect(res.status).toBe(400);
  });

  it('rejects an overly long query (400 chars past limit)', async () => {
    const res = await request(app)
      .post('/api/navigator/query')
      .send({ query: 'x'.repeat(500) });
    expect(res.status).toBe(400);
  });
});
