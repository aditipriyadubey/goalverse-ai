import { describe, it, expect, vi, afterEach } from 'vitest';
import { api, ApiError } from '../services/api';

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe('api client', () => {
  it('resolves with parsed JSON on a successful request', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ destination: 'Washroom Block C', steps: ['a'], estimatedMinutes: 5, aiSource: 'mock' }),
    }) as unknown as typeof fetch;

    const result = await api.navigator.query('nearest washroom', 'Gate 1');
    expect(result.destination).toBe('Washroom Block C');
  });

  it('throws an ApiError with the server message on a failed request', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Invalid request body', details: [] }),
    }) as unknown as typeof fetch;

    await expect(api.navigator.query('a', 'Gate 1')).rejects.toBeInstanceOf(ApiError);
  });

  it('falls back to a generic message when the error body is not JSON', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error('not json');
      },
    }) as unknown as typeof fetch;

    await expect(api.crowd.gates()).rejects.toThrow(/status 500/);
  });
});
