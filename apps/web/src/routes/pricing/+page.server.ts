import type { PageServerLoad } from './$types';
import { calcTotal, buildTiers } from '$lib/server/pricing';

export const load: PageServerLoad = async () => {
  const base = calcTotal({ jobType: 'install-door', qty: 1, address: { line1: '', city: '', state: 'CA', zip: '00000' }, urgency: 'standard' } as any);
  const defaultTiers = buildTiers(base);
  return { defaultTiers, stripeEnabled: Boolean(process.env.STRIPE_SECRET_KEY) };
};

