import { c as create_ssr_component, h as add_attribute, f as each, e as escape } from "../../../chunks/ssr.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let qty = 1;
  let zip = "";
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  return `<div class="max-w-4xl mx-auto p-6 space-y-6"><h1 class="text-2xl font-semibold" data-svelte-h="svelte-1ymcr2v">Instant pricing</h1> <div class="grid md:grid-cols-3 gap-4"><label class="block">Job type
      <select class="mt-2 w-full border rounded p-2"><option value="install-door" data-svelte-h="svelte-yjc71f">Install Door</option><option value="install-opener" data-svelte-h="svelte-18ucuvj">Install Opener</option><option value="repair" data-svelte-h="svelte-1fudw1a">Repair</option><option value="maintenance" data-svelte-h="svelte-qis92c">Maintenance</option></select></label> <label class="block">Quantity
      <input class="mt-2 w-full border rounded p-2" type="number" min="1" max="10"${add_attribute("value", qty, 0)}></label> <label class="block">ZIP Code
      <input class="mt-2 w-full border rounded p-2" type="text" placeholder="90210"${add_attribute("value", zip, 0)}></label></div> <button class="px-4 py-2 rounded bg-black text-white disabled:opacity-50" ${""}>Calculate</button> ${``} ${data?.defaultTiers ? `<div class="grid md:grid-cols-3 gap-4 mt-6">${each(data.defaultTiers, (t) => {
    return `<div class="border rounded p-4"><h3 class="font-semibold">${escape(t.name)}</h3> </div>`;
  })}</div>` : ``} ${``}</div>`;
});
export {
  Page as default
};
