import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

const app = createApp();

describe('GET /api/multilingual/languages', () => {
  it('lists all six supported languages', async () => {
    const res = await request(app).get('/api/multilingual/languages');
    expect(res.status).toBe(200);
    expect(res.body.supported).toHaveLength(6);
    const codes = res.body.supported.map((l: { code: string }) => l.code);
    expect(codes).toEqual(expect.arrayContaining(['en', 'hi', 'es', 'fr', 'pt', 'ar']));
  });
});

describe('POST /api/multilingual/translate', () => {
  it('translates text to a supported target language', async () => {
    const res = await request(app)
      .post('/api/multilingual/translate')
      .send({ text: 'Where is the nearest gate?', targetLang: 'es' });
    expect(res.status).toBe(200);
    expect(res.body.targetLanguage).toBe('es');
    expect(res.body.translatedText).toBeTruthy();
  });

  it('rejects an unsupported target language code', async () => {
    const res = await request(app)
      .post('/api/multilingual/translate')
      .send({ text: 'hello', targetLang: 'de' });
    expect(res.status).toBe(400);
  });

  it('rejects empty text', async () => {
    const res = await request(app)
      .post('/api/multilingual/translate')
      .send({ text: '', targetLang: 'en' });
    expect(res.status).toBe(400);
  });
});
