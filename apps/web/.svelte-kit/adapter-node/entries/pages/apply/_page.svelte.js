import { c as create_ssr_component, h as add_attribute } from "../../../chunks/ssr.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let name = "", email = "", phone = "";
  return `<div class="max-w-3xl mx-auto p-6 space-y-4"><h1 class="text-2xl font-semibold" data-svelte-h="svelte-1kkksgr">Apply as a technician</h1> <div class="grid md:grid-cols-2 gap-4"><input class="border rounded p-2" placeholder="Full name"${add_attribute("value", name, 0)}> <input class="border rounded p-2" placeholder="Phone"${add_attribute("value", phone, 0)}> <input class="border rounded p-2 md:col-span-2" placeholder="Email"${add_attribute("value", email, 0)}> <input class="border rounded p-2 md:col-span-2" type="file" accept=".pdf,.doc,.docx"></div> <button class="px-4 py-2 rounded bg-black text-white" data-svelte-h="svelte-1xo7ezt">Submit</button></div>`;
});
export {
  Page as default
};
