import { describe, it, expect, vi } from 'vitest';

vi.mock('../src/lib/server/db', () => ({
  db: {
    select: () => ({ from: () => ({ where: async () => [] }) })
  }
}));

import { getAvailability } from '../src/lib/server/services/bookings';

describe('bookings availability', () => {
  it('returns slots for range', async () => {
    const from = new Date().toISOString();
    const to = new Date(Date.now() + 24*3600*1000).toISOString();
    const slots = await getAvailability({ from, to });
    expect(Array.isArray(slots)).toBe(true);
  });
});

