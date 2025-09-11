const load = async () => {
  return {
    baseUrl: process.env.BASE_URL || "http://localhost:5173",
    stripeEnabled: Boolean(process.env.STRIPE_SECRET_KEY)
  };
};

var _layout_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 0;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-CcoMwq62.js')).default;
const server_id = "src/routes/+layout.server.ts";
const imports = ["_app/immutable/nodes/0.c9bNuVlM.js","_app/immutable/chunks/scheduler.emDaBF4-.js","_app/immutable/chunks/index.DfoCjhBD.js"];
const stylesheets = ["_app/immutable/assets/0.BNH1PjOk.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=0-BFoduGUv.js.map
