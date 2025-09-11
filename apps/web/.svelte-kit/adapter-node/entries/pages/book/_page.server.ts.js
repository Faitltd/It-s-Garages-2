const load = async ({ url }) => {
  return { estimateId: url.searchParams.get("estimateId") || void 0 };
};
export {
  load
};
