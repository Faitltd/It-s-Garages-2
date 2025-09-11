import type { RequestHandler } from '@sveltejs/kit';
import { EstimateInput } from '$lib/validation/estimate';
import { db } from '$lib/server/db';
import { estimates } from '$lib/server/db/schema';
import { calcTotal, buildTiers, pricingVersion } from '$lib/server/pricing';
import { sanitizeRecord } from '$lib/server/security';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const json = await request.json();
    const parse = EstimateInput.safeParse(json);
    if (!parse.success) {
      return new Response(JSON.stringify({ error: 'Invalid input', issues: parse.error.format() }), { status: 400 });
    }
    const input = sanitizeRecord(parse.data);
    const base = calcTotal(input);
    const tiers = buildTiers(base);

    const hasDb = Boolean(process.env.DATABASE_URL);
    let estimateId: number | string | null = null;
    if (hasDb) {
      const [rec] = await db
        .insert(estimates)
        .values({ matrixVersion: pricingVersion, input, result: { tiers }, total: base, leadEmail: input.contact?.email })
        .returning({ id: estimates.id });
      estimateId = rec.id;
    } else {
      estimateId = 'dev-estimate';
    }

    return new Response(JSON.stringify({ estimateId, tiers, matrixVersion: pricingVersion }), {
      headers: { 'content-type': 'application/json' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || 'Server error' }), { status: 500 });
  }
};

