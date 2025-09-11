import { c as calcTotal, b as buildTiers } from './pricing-VBcjWTry.js';

const load = async () => {
  const base = calcTotal({ jobType: "install-door", qty: 1, urgency: "standard" });
  const defaultTiers = buildTiers(base);
  return { defaultTiers, stripeEnabled: Boolean(process.env.STRIPE_SECRET_KEY) };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 8;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-t3JrGglg.js')).default;
const server_id = "src/routes/pricing/+page.server.ts";
const imports = ["_app/immutable/nodes/8.BqfvA1a2.js","_app/immutable/chunks/scheduler.emDaBF4-.js","_app/immutable/chunks/index.DfoCjhBD.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=8-BIox42iF.js.map
