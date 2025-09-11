import { pgTable, varchar, integer, jsonb, timestamp, serial, index, numeric, text, boolean, uniqueIndex } from "drizzle-orm/pg-core";
const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  name: varchar("name", { length: 120 }),
  email: varchar("email", { length: 160 }),
  phone: varchar("phone", { length: 40 }),
  address1: varchar("address1", { length: 200 }),
  city: varchar("city", { length: 80 }),
  state: varchar("state", { length: 2 }),
  zip: varchar("zip", { length: 12 }),
  utm: jsonb("utm"),
  estimateId: integer("estimate_id"),
  stage: varchar("stage", { length: 40 }).default("new")
}, (t) => ({
  leadsEmailIdx: index("leads_email_idx").on(t.email),
  leadsStageIdx: index("leads_stage_idx").on(t.stage),
  leadsZipIdx: index("leads_zip_idx").on(t.zip)
}));
const estimates = pgTable("estimates", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  matrixVersion: varchar("matrix_version", { length: 32 }),
  input: jsonb("input"),
  result: jsonb("result"),
  total: numeric("total", { precision: 12, scale: 2 }),
  leadEmail: varchar("lead_email", { length: 160 })
}, (t) => ({
  estimatesLeadEmailIdx: index("estimates_lead_email_idx").on(t.leadEmail),
  estimatesCreatedIdx: index("estimates_created_idx").on(t.createdAt)
}));
const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id"),
  techId: integer("tech_id"),
  start: timestamp("start"),
  end: timestamp("end"),
  status: varchar("status", { length: 24 }).default("pending"),
  notes: text("notes")
}, (t) => ({
  apptLeadIdx: index("appointments_lead_id_idx").on(t.leadId),
  apptTechIdx: index("appointments_tech_id_idx").on(t.techId),
  apptTimeIdx: index("appointments_time_idx").on(t.start, t.end)
}));
const technicians = pgTable("technicians", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }),
  phone: varchar("phone", { length: 40 }),
  email: varchar("email", { length: 160 }),
  serviceAreas: jsonb("service_areas"),
  // ZIP codes array
  skills: jsonb("skills"),
  // ["install-door", "opener", "repair"]
  active: boolean("active").default(true)
}, (t) => ({
  techActiveIdx: index("technicians_active_idx").on(t.active)
}));
const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  estimateId: integer("estimate_id"),
  stripeSessionId: varchar("stripe_session_id", { length: 200 }),
  amount: numeric("amount", { precision: 12, scale: 2 }),
  status: varchar("status", { length: 24 }).default("created")
}, (t) => ({
  paymentsSessionUid: uniqueIndex("payments_session_uid").on(t.stripeSessionId),
  paymentsEstimateIdx: index("payments_estimate_idx").on(t.estimateId)
}));
export {
  appointments as a,
  estimates as e,
  leads as l,
  payments as p,
  technicians as t
};
