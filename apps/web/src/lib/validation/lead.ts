import { z } from 'zod';

export const LeadInput = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(7),
  address1: z.string(),
  city: z.string(),
  state: z.string().length(2),
  zip: z.string(),
  estimateId: z.number().int().optional(),
  utm: z.record(z.string()).optional(),
  token: z.string().optional() // captcha token
});

export type LeadInputType = z.infer<typeof LeadInput>;

