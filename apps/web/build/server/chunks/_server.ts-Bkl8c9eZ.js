import { g as getAvailability } from './bookings-YEjRfxoB.js';
import './index-D2j6Gy4i.js';
import 'drizzle-orm/node-postgres';
import 'pg';
import './schema-CaDzoj12.js';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';

const GET = async ({ url }) => {
  const from = url.searchParams.get("from") || (/* @__PURE__ */ new Date()).toISOString();
  const to = url.searchParams.get("to") || new Date(Date.now() + 7 * 24 * 3600 * 1e3).toISOString();
  const zip = url.searchParams.get("zip") || void 0;
  const slots = await getAvailability({ from, to, zip });
  return new Response(JSON.stringify({ slots }), { headers: { "content-type": "application/json" } });
};

export { GET };
//# sourceMappingURL=_server.ts-Bkl8c9eZ.js.map
