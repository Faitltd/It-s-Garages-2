const load = async ({ url }) => {
  return { estimateId: url.searchParams.get("estimateId") || void 0 };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 4;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DHpVEs8H.js')).default;
const server_id = "src/routes/book/+page.server.ts";
const imports = ["_app/immutable/nodes/4.C-UWtBU2.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/scheduler.emDaBF4-.js","_app/immutable/chunks/index.DfoCjhBD.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=4-BOVX3Cum.js.map
