import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

const app = createApp();

describe('POST /api/planner/itinerary', () => {
  it('creates a personalized match day itinerary', async () => {
    const res = await request(app).post('/api/planner/itinerary').send({
      ownerName: 'Priya',
      matchName: 'Group Stage: Brazil vs Argentina',
      seatSection: 'Section 114, Row F',
      arrivalTime: '2026-07-01T15:00:00Z',
      companions: 3,
      transportMode: 'metro',
    });
    expect(res.status).toBe(201);
    expect(res.body.timeline.length).toBeGreaterThan(0);
    expect(res.body.id).toBeTypeOf('string');
  });

  it('rejects an invalid transport mode', async () => {
    const res = await request(app).post('/api/planner/itinerary').send({
      ownerName: 'Priya',
      matchName: 'Group Stage',
      seatSection: 'Section 1',
      arrivalTime: '2026-07-01T15:00:00Z',
      companions: 1,
      transportMode: 'teleport',
    });
    expect(res.status).toBe(400);
  });

  it('returns 404 for a non-existent itinerary id', async () => {
    const res = await request(app).get('/api/planner/itinerary/does-not-exist');
    expect(res.status).toBe(404);
  });
});

describe('GET /api/organizer/insight', () => {
  it('returns an operational intelligence summary', async () => {
    const res = await request(app).get('/api/organizer/insight');
    expect(res.status).toBe(200);
    expect(res.body.summary).toBeTypeOf('string');
    expect(res.body.peakPrediction).toBeTypeOf('string');
    expect(Array.isArray(res.body.trends)).toBe(true);
  });
});
