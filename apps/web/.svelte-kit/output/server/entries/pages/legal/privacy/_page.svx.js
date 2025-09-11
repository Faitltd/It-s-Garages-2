import { c as create_ssr_component, v as validate_component, e as escape } from "../../../../chunks/ssr.js";
import { M as MarkdownLayout } from "../../../../chunks/MarkdownLayout.js";
const metadata = { "title": "Privacy Policy" };
const { title } = metadata;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(MarkdownLayout, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign({}, $$props, metadata), {}, {
    default: () => {
      return `<p data-svelte-h="svelte-1635l88">We respect your privacy. This policy explains what we collect and how we use it.</p> <h2 data-svelte-h="svelte-1j13vum">Information we collect</h2> <ul><li data-svelte-h="svelte-12g3r0a">Contact details you provide (name, email, phone, address)</li> <li data-svelte-h="svelte-1tctqia">Booking and estimate details</li> <li data-svelte-h="svelte-9xi9is">Technical logs necessary to operate the service</li></ul> <h2 data-svelte-h="svelte-1qb04ud">How we use information</h2> <ul><li data-svelte-h="svelte-bx7eyy">Provide estimates, schedule service, process payments, and communicate updates</li> <li data-svelte-h="svelte-w7war8">Improve reliability and safety of the service</li></ul> <h2 data-svelte-h="svelte-nh863m">Sharing</h2> <p data-svelte-h="svelte-1rxijid">We do not sell personal data. We share data only with service providers necessary to operate (e.g., payment processors, email/SMS providers) under contractual obligations.</p> <h2 data-svelte-h="svelte-ju725j">Security and retention</h2> <p data-svelte-h="svelte-v3clps">We apply reasonable technical and organizational safeguards. Data is retained only as long as needed to provide services and meet legal obligations.</p> <h2 data-svelte-h="svelte-jw3mz9">Your choices</h2> <p data-svelte-h="svelte-zfdhf2">Contact us to access or delete your data where applicable.</p> <p>Effective date: ${escape((/* @__PURE__ */ new Date()).toISOString().slice(0, 10))}</p>`;
    }
  })}`;
});
export {
  Page as default,
  metadata
};
