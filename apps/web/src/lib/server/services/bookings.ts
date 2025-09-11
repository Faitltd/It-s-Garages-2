import { db } from '../db';
import { appointments, technicians } from '../db/schema';
import { and, between, eq, sql } from 'drizzle-orm';

export type AvailabilitySlot = { start: string; end: string; techId: number };

export async function getAvailability({ zip, from, to }: { zip?: string; from: string; to: string }): Promise<AvailabilitySlot[]> {
  // naive availability: list technicians active; return open slots every 2 hours 9-5 next 7 days
  const activeTechs = await db.select().from(technicians).where(eq(technicians.active, true));
  const slots: AvailabilitySlot[] = [];
  const start = new Date(from);
  const end = new Date(to);
  for (const tech of activeTechs) {
    const d = new Date(start);
    while (d <= end) {
      for (let hour = 9; hour <= 15; hour += 2) {
        const s = new Date(d); s.setHours(hour, 0, 0, 0);
        const e = new Date(s); e.setHours(s.getHours() + 2);
        slots.push({ start: s.toISOString(), end: e.toISOString(), techId: tech.id as number });
      }
      d.setDate(d.getDate() + 1);
    }
  }
  return slots;
}

export async function createBooking({ leadId, techId, start, end, notes }: { leadId: number; techId: number; start: string; end: string; notes?: string }) {
  const [row] = await db.insert(appointments).values({ leadId, techId, start: new Date(start), end: new Date(end), notes }).returning();
  return row;
}

