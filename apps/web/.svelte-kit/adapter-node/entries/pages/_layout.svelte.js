import { c as create_ssr_component, e as escape } from "../../chunks/ssr.js";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="min-h-screen flex flex-col"><header class="border-b bg-white/70 dark:bg-black/30 backdrop-blur"><div class="max-w-6xl mx-auto p-4 flex items-center justify-between"><a href="/" class="font-semibold text-lg" data-svelte-h="svelte-101lxs9">It’s Garages</a> <nav class="space-x-4 text-sm"><a href="/pricing" data-svelte-h="svelte-1b4dew3">Pricing</a> <a href="/book" data-svelte-h="svelte-l1zo0f">Book</a> <a href="/apply" data-svelte-h="svelte-l4oanf">Apply</a> <a href="/legal/terms" data-svelte-h="svelte-1hdthdv">Terms</a></nav></div></header> <main class="flex-1">${slots.default ? slots.default({}) : ``}</main> <footer class="border-t text-center text-sm py-6 opacity-70">© ${escape((/* @__PURE__ */ new Date()).getFullYear())} It’s Garages • <a class="underline" href="/legal/privacy" data-svelte-h="svelte-1omo3lg">Privacy</a></footer></div>`;
});
export {
  Layout as default
};
