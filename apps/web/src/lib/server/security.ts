import { z } from 'zod';

// Basic string sanitization to mitigate XSS in echoed fields (server-side)
export function sanitizeString(input: unknown, maxLen = 500) {
  if (typeof input !== 'string') return '';
  const trimmed = input.trim().slice(0, maxLen);
  // Remove control chars and angle brackets; normalize whitespace
  return trimmed.replace(/[\u0000-\u001F\u007F<>]/g, '').replace(/\s+/g, ' ');
}

export function sanitizeRecord<T extends Record<string, any>>(obj: T): T {
  const out: any = Array.isArray(obj) ? [] : {};
  for (const k in obj) {
    const v = obj[k];
    if (typeof v === 'string') out[k] = sanitizeString(v);
    else if (v && typeof v === 'object') out[k] = sanitizeRecord(v);
    else out[k] = v;
  }
  return out as T;
}

export const BearerSchema = z.string().regex(/^Bearer\s+.+/);
export function requireApiKey(headers: Headers, keyName = 'x-api-key') {
  const provided = headers.get(keyName);
  if (!provided) return false;
  const expected = process.env.ADMIN_API_KEY;
  return Boolean(expected) && provided === expected;
}

