import * as server from '../entries/pages/pricing/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pricing/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/pricing/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.BqfvA1a2.js","_app/immutable/chunks/scheduler.emDaBF4-.js","_app/immutable/chunks/index.DfoCjhBD.js"];
export const stylesheets = [];
export const fonts = [];
