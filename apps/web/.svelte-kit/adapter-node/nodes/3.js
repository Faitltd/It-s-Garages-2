

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/apply/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.C0_N5vAg.js","_app/immutable/chunks/scheduler.emDaBF4-.js","_app/immutable/chunks/index.DfoCjhBD.js"];
export const stylesheets = [];
export const fonts = [];
