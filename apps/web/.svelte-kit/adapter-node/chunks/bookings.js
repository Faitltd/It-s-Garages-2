import { d as db } from "./index.js";
import { t as technicians, a as appointments } from "./schema.js";
import { eq } from "drizzle-orm";
async function getAvailability({ zip, from, to }) {
  const activeTechs = await db.select().from(technicians).where(eq(technicians.active, true));
  const slots = [];
  const start = new Date(from);
  const end = new Date(to);
  for (const tech of activeTechs) {
    const d = new Date(start);
    while (d <= end) {
      for (let hour = 9; hour <= 15; hour += 2) {
        const s = new Date(d);
        s.setHours(hour, 0, 0, 0);
        const e = new Date(s);
        e.setHours(s.getHours() + 2);
        slots.push({ start: s.toISOString(), end: e.toISOString(), techId: tech.id });
      }
      d.setDate(d.getDate() + 1);
    }
  }
  return slots;
}
async function createBooking({ leadId, techId, start, end, notes }) {
  const [row] = await db.insert(appointments).values({ leadId, techId, start: new Date(start), end: new Date(end), notes }).returning();
  return row;
}
export {
  createBooking as c,
  getAvailability as g
};
