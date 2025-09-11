import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  return { estimateId: url.searchParams.get('estimateId') || undefined };
};

