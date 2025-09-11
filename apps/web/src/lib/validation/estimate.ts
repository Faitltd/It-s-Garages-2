import { z } from "zod";

export const EstimateInput = z.object({
  jobType: z.enum(["install-door","install-opener","repair","maintenance"]),
  door: z.object({
    size: z.enum(["single","double"]).optional(),
    build: z.enum(["steel-non-insulated","steel-insulated-r8"]).optional(),
    windows: z.boolean().optional()
  }).optional(),
  opener: z.object({
    type: z.enum(["chain","belt-quiet"]).optional(),
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
  urgency: z.enum(["standard","same_day","after_hours"]),
  difficulty: z.enum(["none","low_headroom","tight_space"]).optional(),
  contact: z.object({ name: z.string(), phone: z.string(), email: z.string().email() }).optional(),
  utm: z.record(z.string()).optional()
});

export type EstimateInputType = z.infer<typeof EstimateInput>;

