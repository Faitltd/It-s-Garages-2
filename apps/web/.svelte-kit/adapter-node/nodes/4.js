import * as server from '../entries/pages/book/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/book/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/book/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.C-UWtBU2.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/scheduler.emDaBF4-.js","_app/immutable/chunks/index.DfoCjhBD.js"];
export const stylesheets = [];
export const fonts = [];
