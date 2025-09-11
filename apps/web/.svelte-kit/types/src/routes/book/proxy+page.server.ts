// @ts-nocheck
import type { PageServerLoad } from './$types';

export const load = async ({ url }: Parameters<PageServerLoad>[0]) => {
  return { estimateId: url.searchParams.get('estimateId') || undefined };
};

