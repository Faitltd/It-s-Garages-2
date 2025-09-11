import { describe, it, expect, vi } from 'vitest';

vi.mock('../src/lib/server/db', () => ({
  db: {
    insert: () => ({ values: () => ({ returning: async () => [{ id: 42 }] }) })
  }
}));

import * as route from '../src/routes/api/estimate/+server';

function makeReq(body: any) {
  return new Request('http://localhost/api/estimate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
}

describe('POST /api/estimate', () => {
  it('accepts valid input and returns tiers', async () => {
    const req = makeReq({ jobType: 'maintenance', qty: 1, address: { line1: 'x', city: 'x', state: 'CA', zip: '90001' }, urgency: 'standard' });
    const res = await (route as any).POST({ request: req });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty('estimateId');
    expect(Array.isArray(json.tiers)).toBe(true);
  });

  it('rejects invalid input', async () => {
    const req = makeReq({});
    const res = await (route as any).POST({ request: req });
    expect(res.status).toBe(400);
  });
});

