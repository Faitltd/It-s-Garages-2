import { describe, it, expect } from 'vitest';
import { calcTotal, buildTiers, pricingVersion } from '../src/lib/server/pricing';

describe('pricing', () => {
  it('calculates install-door base', () => {
    const total = calcTotal({ jobType: 'install-door', door: { size: 'single', build: 'steel-non-insulated' }, qty: 1, address: { line1: 'x', city: 'x', state: 'CA', zip: '90001' }, urgency: 'standard' });
    expect(total).toBeGreaterThan(0);
  });
  it('applies tiers correctly', () => {
    const tiers = buildTiers(10000);
    expect(tiers).toHaveLength(3);
    expect(tiers[0].total).toBeGreaterThan(0);
  });
});

