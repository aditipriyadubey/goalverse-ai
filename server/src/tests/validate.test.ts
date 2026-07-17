import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import { z } from 'zod';
import { validateBody } from '../middleware/validate.js';

function buildTestApp() {
  const app = express();
  app.use(express.json());
  const schema = z.object({ name: z.string().min(1), age: z.number().int().positive() });
  app.post('/echo', validateBody(schema), (req, res) => {
    res.json({ received: req.body });
  });
  return app;
}

describe('validateBody middleware', () => {
  const app = buildTestApp();

  it('passes through valid input', async () => {
    const res = await request(app).post('/echo').send({ name: 'Alex', age: 30 });
    expect(res.status).toBe(200);
    expect(res.body.received).toEqual({ name: 'Alex', age: 30 });
  });

  it('rejects invalid input with 400 and details', async () => {
    const res = await request(app).post('/echo').send({ name: '', age: -1 });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid request body');
    expect(Array.isArray(res.body.details)).toBe(true);
    expect(res.body.details.length).toBeGreaterThan(0);
  });

  it('rejects missing fields', async () => {
    const res = await request(app).post('/echo').send({});
    expect(res.status).toBe(400);
  });
});
