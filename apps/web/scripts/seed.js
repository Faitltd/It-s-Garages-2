// Simple seed script to add a couple of active technicians
// Usage: node apps/web/scripts/seed.js
import { Client } from 'pg';

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL not set. Aborting.');
    process.exit(1);
  }
  const client = new Client({ connectionString: url, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined });
  await client.connect();
  try {
    const { rows } = await client.query('SELECT COUNT(*) AS c FROM technicians');
    const count = Number(rows?.[0]?.c || 0);
    if (count > 0) {
      console.log('Technicians already present, skipping.');
      return;
    }
    await client.query(
      `INSERT INTO technicians (name, phone, email, service_areas, skills, active) VALUES
       ($1,$2,$3,$4,$5,true),
       ($6,$7,$8,$9,$10,true)`,
      [
        'Alex Johnson', '+15551230001', 'alex@example.com', JSON.stringify(['90001','90002','90003']), JSON.stringify(['install-door','install-opener','repair']),
        'Jamie Lee', '+15551230002', 'jamie@example.com', JSON.stringify(['90210','90211','90212']), JSON.stringify(['repair','maintenance'])
      ]
    );
    console.log('Seeded 2 technicians.');
  } catch (e) {
    console.error('Seed error:', e);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();

