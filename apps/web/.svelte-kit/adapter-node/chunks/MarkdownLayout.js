import { c as create_ssr_component, e as escape } from "./ssr.js";
const MarkdownLayout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title = "" } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
  return `<article class="prose dark:prose-invert max-w-3xl mx-auto p-6">${title ? `<h1>${escape(title)}</h1>` : ``} ${slots.default ? slots.default({}) : ``}</article>`;
});
export {
  MarkdownLayout as M
};
