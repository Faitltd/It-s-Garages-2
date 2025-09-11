import { c as create_ssr_component } from "../../../chunks/ssr.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  `https://cal.com/itsgarages/booking?embed=inline${data?.estimateId ? `&estimateId=${data.estimateId}` : ""}`;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  return `<div class="max-w-5xl mx-auto p-6"><h1 class="text-2xl font-semibold mb-4" data-svelte-h="svelte-1787tjv">Book your appointment</h1> ${`<div class="border rounded p-6 text-center text-sm opacity-.75" data-svelte-h="svelte-1kbljvq">Loading calendar…</div>`}</div>`;
});
export {
  Page as default
};
