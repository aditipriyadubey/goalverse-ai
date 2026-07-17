/**
 * AI Service — the single integration point with Google Gemini.
 *
 * Design goals:
 *  - Every caller gets back validated, typed JSON (never raw model text).
 *  - Transient failures are retried with backoff; permanent failures fail closed.
 *  - Identical requests are cached briefly to cut latency and API spend.
 *  - If no GEMINI_API_KEY is configured, we deterministically fall back to a
 *    local mock generator so the whole product still runs end-to-end for
 *    reviewers who don't want to provision a key.
 *  - User-provided text is sanitized before being interpolated into prompts,
 *    to reduce prompt-injection risk from free-text fields (locations, item
 *    descriptions, etc).
 */

import { z } from 'zod';

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const API_KEY = process.env.GEMINI_API_KEY?.trim();

const GEMINI_URL = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 350;
const CACHE_TTL_MS = 60_000;

interface CacheEntry {
  value: unknown;
  expiresAt: number;
}
const responseCache = new Map<string, CacheEntry>();

/** Strip characters/patterns commonly used for prompt injection or control-sequence abuse. */
export function sanitizePromptInput(raw: string, maxLen = 400): string {
  if (typeof raw !== 'string') return '';
  return raw
    .slice(0, maxLen)
    .replace(/[\u0000-\u001F\u007F]/g, ' ') // control chars
    .replace(/```/g, "'''") // neutralize fence breakout attempts
    .replace(/\b(ignore|disregard)\s+(all|previous|prior)\s+instructions?\b/gi, '[filtered]')
    .trim();
}

function cacheKey(prompt: string, schemaName: string): string {
  return `${schemaName}::${prompt}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGeminiRaw(prompt: string): Promise<string> {
  if (!API_KEY) {
    throw new Error('NO_API_KEY');
  }
  const res = await fetch(GEMINI_URL(GEMINI_MODEL), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!res.ok) {
    const status = res.status;
    // 429/5xx are treated as retryable by the caller; 4xx (other than 429) are not.
    const err = new Error(`GEMINI_HTTP_${status}`);
    (err as Error & { retryable?: boolean }).retryable = status === 429 || status >= 500;
    throw err;
  }

  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('GEMINI_EMPTY_RESPONSE');
  }
  return text;
}

async function callGeminiWithRetry(prompt: string): Promise<string> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await callGeminiRaw(prompt);
    } catch (err) {
      lastError = err;
      const retryable = (err as Error & { retryable?: boolean }).retryable !== false;
      const isLastAttempt = attempt === MAX_RETRIES;
      if (!retryable || isLastAttempt) break;
      await sleep(RETRY_BASE_DELAY_MS * 2 ** attempt);
    }
  }
  throw lastError instanceof Error ? lastError : new Error('GEMINI_UNKNOWN_ERROR');
}

/**
 * Generate structured, schema-validated JSON from a prompt.
 * Falls back to `mockFn` whenever Gemini is unavailable, unconfigured, or
 * returns something that fails validation — the caller never sees a raw
 * unstructured failure.
 */
export async function generateStructured<T>(opts: {
  prompt: string;
  schema: z.ZodType<T>;
  schemaName: string;
  mockFn: () => T;
  useCache?: boolean;
}): Promise<{ data: T; source: 'gemini' | 'mock' }> {
  const { prompt, schema, schemaName, mockFn, useCache = true } = opts;
  const key = cacheKey(prompt, schemaName);

  if (useCache) {
    const cached = responseCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return { data: cached.value as T, source: 'gemini' };
    }
  }

  if (!API_KEY) {
    return { data: mockFn(), source: 'mock' };
  }

  try {
    const raw = await callGeminiWithRetry(prompt);
    const parsedJson: unknown = JSON.parse(raw);
    const parsed = schema.safeParse(parsedJson);
    if (!parsed.success) {
      // Model returned malformed structure — fail closed to the mock rather
      // than leaking an unvalidated shape to the client.
      return { data: mockFn(), source: 'mock' };
    }
    if (useCache) {
      responseCache.set(key, { value: parsed.data, expiresAt: Date.now() + CACHE_TTL_MS });
    }
    return { data: parsed.data, source: 'gemini' };

  } catch (err) {
    console.error("Gemini Error:", err);
    return { data: mockFn(), source: "mock" };
  }
}

export function clearAiCache(): void {
  responseCache.clear();
}
