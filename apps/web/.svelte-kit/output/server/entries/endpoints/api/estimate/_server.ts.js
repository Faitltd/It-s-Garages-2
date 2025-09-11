import { z } from "zod";
import { d as db } from "../../../../chunks/index.js";
import { e as estimates } from "../../../../chunks/schema.js";
import { c as calcTotal, b as buildTiers, p as pricingVersion } from "../../../../chunks/pricing.js";
import { s as sanitizeRecord } from "../../../../chunks/security.js";
const EstimateInput = z.object({
  jobType: z.enum(["install-door", "install-opener", "repair", "maintenance"]),
  door: z.object({
    size: z.enum(["single", "double"]).optional(),
    build: z.enum(["steel-non-insulated", "steel-insulated-r8"]).optional(),
    windows: z.boolean().optional()
  }).optional(),
  opener: z.object({
    type: z.enum(["chain", "belt-quiet"]).optional(),
    smartAddon: z.boolean().optional(),
    keypad: z.boolean().optional()
  }).optional(),
  hardware: z.object({
    springsPair: z.boolean().optional(),
    rollersSet: z.boolean().optional(),
    haulAway: z.boolean().optional()
  }).optional(),
  qty: z.number().int().min(1).max(10).default(1),
  address: z.object({ line1: z.string(), city: z.string(), state: z.string().length(2), zip: z.string() }),
  urgency: z.enum(["standard", "same_day", "after_hours"]),
  difficulty: z.enum(["none", "low_headroom", "tight_space"]).optional(),
  contact: z.object({ name: z.string(), phone: z.string(), email: z.string().email() }).optional(),
  utm: z.record(z.string()).optional()
});
const POST = async ({ request }) => {
  try {
    const json = await request.json();
    const parse = EstimateInput.safeParse(json);
    if (!parse.success) {
      return new Response(JSON.stringify({ error: "Invalid input", issues: parse.error.format() }), { status: 400 });
    }
    const input = sanitizeRecord(parse.data);
    const base = calcTotal(input);
    const tiers = buildTiers(base);
    const hasDb = Boolean(process.env.DATABASE_URL);
    let estimateId = null;
    if (hasDb) {
      const [rec] = await db.insert(estimates).values({ matrixVersion: pricingVersion, input, result: { tiers }, total: base, leadEmail: input.contact?.email }).returning({ id: estimates.id });
      estimateId = rec.id;
    } else {
      estimateId = "dev-estimate";
    }
    return new Response(JSON.stringify({ estimateId, tiers, matrixVersion: pricingVersion }), {
      headers: { "content-type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "Server error" }), { status: 500 });
  }
};
export {
  POST
};
