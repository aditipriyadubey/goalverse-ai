import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

const app = createApp();

describe('POST /api/volunteer/lost-found', () => {
  it('creates a lost & found report', async () => {
    const res = await request(app)
      .post('/api/volunteer/lost-found')
      .send({ itemDesc: 'Blue backpack', location: 'Gate 3 concourse', reportedBy: 'Steward Jane' });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('open');
  });

  it('rejects a report missing required fields', async () => {
    const res = await request(app).post('/api/volunteer/lost-found').send({ itemDesc: 'x' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/volunteer/incidents', () => {
  it('creates an incident report with valid enum values', async () => {
    const res = await request(app).post('/api/volunteer/incidents').send({
      type: 'medical',
      severity: 'high',
      zone: 'North',
      description: 'Fan reported dizziness near Section 12',
    });
    expect(res.status).toBe(201);
    expect(res.body.type).toBe('medical');
  });

  it('rejects an invalid severity value', async () => {
    const res = await request(app).post('/api/volunteer/incidents').send({
      type: 'medical',
      severity: 'catastrophic',
      zone: 'North',
      description: 'test',
    });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/volunteer/summary', () => {
  it('returns an AI-style operational summary', async () => {
    const res = await request(app).get('/api/volunteer/summary');
    expect(res.status).toBe(200);
    expect(res.body.summary).toBeTypeOf('string');
    expect(Array.isArray(res.body.priorityActions)).toBe(true);
  });
});
