import { c as create_ssr_component, v as validate_component } from "../../../../chunks/ssr.js";
import { M as MarkdownLayout } from "../../../../chunks/MarkdownLayout.js";
const metadata = { "title": "Repair Service" };
const { title } = metadata;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(MarkdownLayout, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign({}, $$props, metadata), {}, {
    default: () => {
      return `<h1 data-svelte-h="svelte-yz4gte">Repair Service</h1> <p data-svelte-h="svelte-acbe4m">Fast, fair repairs for springs, rollers, tracks, cables, and more.</p> <ul><li data-svelte-h="svelte-1vvnuqm">Upfront pricing and quick scheduling</li> <li data-svelte-h="svelte-yl2x10">Safety inspection included</li> <li data-svelte-h="svelte-5rmfdo">Parts backed by manufacturer warranties</li></ul>`;
    }
  })}`;
});
export {
  Page as default,
  metadata
};
