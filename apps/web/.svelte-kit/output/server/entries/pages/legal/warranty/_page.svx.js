import { c as create_ssr_component, v as validate_component, e as escape } from "../../../../chunks/ssr.js";
import { M as MarkdownLayout } from "../../../../chunks/MarkdownLayout.js";
const metadata = { "title": "Warranty Information" };
const { title } = metadata;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(MarkdownLayout, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign({}, $$props, metadata), {}, {
    default: () => {
      return `<h2 data-svelte-h="svelte-16ewgql">Workmanship warranty</h2> <p data-svelte-h="svelte-wke782">Our workmanship is warranted for 12 months from service completion. If issues arise due to workmanship, we will repair at no additional charge.</p> <h2 data-svelte-h="svelte-b2wjw8">Parts warranty</h2> <p data-svelte-h="svelte-1vgw37u">Manufacturer warranties apply to parts. We can assist with claims where applicable.</p> <h2 data-svelte-h="svelte-fcxjs3">Exclusions</h2> <p data-svelte-h="svelte-13x4wkq">Normal wear and tear, misuse, accidents, and third-party modifications are not covered.</p> <p>Effective date: ${escape((/* @__PURE__ */ new Date()).toISOString().slice(0, 10))}</p>`;
    }
  })}`;
});
export {
  Page as default,
  metadata
};
