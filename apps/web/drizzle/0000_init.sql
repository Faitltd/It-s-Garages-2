-- drizzle initial migration for PostgreSQL

CREATE TABLE IF NOT EXISTS leads (
  id serial PRIMARY KEY,
  created_at timestamp DEFAULT now(),
  name varchar(120),
  email varchar(160),
  phone varchar(40),
  address1 varchar(200),
  city varchar(80),
  state varchar(2),
  zip varchar(12),
  utm jsonb,
  estimate_id integer,
  stage varchar(40) DEFAULT 'new'
);
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);
CREATE INDEX IF NOT EXISTS leads_stage_idx ON leads(stage);
CREATE INDEX IF NOT EXISTS leads_zip_idx ON leads(zip);

CREATE TABLE IF NOT EXISTS estimates (
  id serial PRIMARY KEY,
  created_at timestamp DEFAULT now(),
  matrix_version varchar(32),
  input jsonb,
  result jsonb,
  total numeric(12,2),
  lead_email varchar(160)
);
CREATE INDEX IF NOT EXISTS estimates_lead_email_idx ON estimates(lead_email);
CREATE INDEX IF NOT EXISTS estimates_created_idx ON estimates(created_at);

CREATE TABLE IF NOT EXISTS appointments (
  id serial PRIMARY KEY,
  lead_id integer,
  tech_id integer,
  start timestamp,
  "end" timestamp,
  status varchar(24) DEFAULT 'pending',
  notes text
);
CREATE INDEX IF NOT EXISTS appointments_lead_id_idx ON appointments(lead_id);
CREATE INDEX IF NOT EXISTS appointments_tech_id_idx ON appointments(tech_id);
CREATE INDEX IF NOT EXISTS appointments_time_idx ON appointments(start, "end");

CREATE TABLE IF NOT EXISTS technicians (
  id serial PRIMARY KEY,
  name varchar(120),
  phone varchar(40),
  email varchar(160),
  service_areas jsonb,
  skills jsonb,
  active boolean DEFAULT true
);
CREATE INDEX IF NOT EXISTS technicians_active_idx ON technicians(active);

CREATE TABLE IF NOT EXISTS payments (
  id serial PRIMARY KEY,
  estimate_id integer,
  stripe_session_id varchar(200),
  amount numeric(12,2),
  status varchar(24) DEFAULT 'created'
);
CREATE UNIQUE INDEX IF NOT EXISTS payments_session_uid ON payments(stripe_session_id);
CREATE INDEX IF NOT EXISTS payments_estimate_idx ON payments(estimate_id);

