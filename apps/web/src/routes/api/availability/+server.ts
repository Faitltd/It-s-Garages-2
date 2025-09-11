import type { RequestHandler } from '@sveltejs/kit';
import { getAvailability } from '$lib/server/services/bookings';

export const GET: RequestHandler = async ({ url }) => {
  const from = url.searchParams.get('from') || new Date().toISOString();
  const to = url.searchParams.get('to') || new Date(Date.now() + 7*24*3600*1000).toISOString();
  const zip = url.searchParams.get('zip') || undefined;
  const slots = await getAvailability({ from, to, zip });
  return new Response(JSON.stringify({ slots }), { headers: { 'content-type': 'application/json' } });
};

