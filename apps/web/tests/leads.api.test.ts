import { describe, it, expect, vi } from 'vitest';

vi.mock('../src/lib/server/db', () => ({
  db: {
    insert: () => ({ values: () => ({ returning: async () => [{ id: 7 }] }) })
  }
}));
vi.mock('../src/lib/server/services/email', () => ({ sendEmail: async () => {} }));
vi.mock('../src/lib/server/services/sms', () => ({ sendSMS: async () => {} }));

import * as route from '../src/routes/api/leads/+server';

function makeReq(body: any) {
  return new Request('http://localhost/api/leads', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
}

describe('POST /api/leads', () => {
  it('creates lead and returns bookingUrl', async () => {
    const req = makeReq({
      name: 'Jane', email: 'jane@example.com', phone: '+15551234567',
      address1: '123 Main', city: 'LA', state: 'CA', zip: '90001',
      token: 'dev-token'
    });
    const res = await (route as any).POST({ request: req, url: new URL('http://localhost') });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty('id');
    expect(json).toHaveProperty('bookingUrl');
  });

  it('rejects invalid input', async () => {
    const req = makeReq({});
    const res = await (route as any).POST({ request: req, url: new URL('http://localhost') });
    expect(res.status).toBe(400);
  });
});

