// @ts-nocheck
import type { LayoutServerLoad } from './$types';

export const load = async () => {
  return {
    baseUrl: process.env.BASE_URL || 'http://localhost:5173',
    stripeEnabled: Boolean(process.env.STRIPE_SECRET_KEY)
  };
};

;null as any as LayoutServerLoad;