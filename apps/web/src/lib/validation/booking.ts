import { z } from 'zod';

export const BookingInput = z.object({
  leadId: z.number().int(),
  techId: z.number().int(),
  start: z.string(), // ISO
  end: z.string(),
  notes: z.string().optional()
});

export type BookingInputType = z.infer<typeof BookingInput>;

