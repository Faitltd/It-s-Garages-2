import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL as string;
if (!connectionString) {
  console.warn('DATABASE_URL not set. Database operations will fail.');
}

const pool = new Pool({ connectionString, max: 5, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined });
export const db = drizzle(pool);
export { pool };

