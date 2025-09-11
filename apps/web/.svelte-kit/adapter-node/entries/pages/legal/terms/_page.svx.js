import { c as create_ssr_component, v as validate_component, e as escape } from "../../../../chunks/ssr.js";
import { M as MarkdownLayout } from "../../../../chunks/MarkdownLayout.js";
const metadata = { "title": "Terms of Service" };
const { title } = metadata;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(MarkdownLayout, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign({}, $$props, metadata), {}, {
    default: () => {
      return `<p data-svelte-h="svelte-ut1tgq">By using It’s Garages, you agree to these terms.</p> <h2 data-svelte-h="svelte-iwvpsi">Services</h2> <p data-svelte-h="svelte-1ctg59b">We provide garage door installation, opener installation, repairs, and maintenance. Schedules are estimates and subject to availability.</p> <h2 data-svelte-h="svelte-r8jrgg">Pricing and payments</h2> <p data-svelte-h="svelte-1v0pfke">Prices shown during estimating are estimates; final pricing may vary based on onsite conditions. Deposits processed via Stripe are applied to the final invoice.</p> <h2 data-svelte-h="svelte-5nouau">Cancellations</h2> <p data-svelte-h="svelte-1tcnvx9">Please notify us at least 24 hours in advance to avoid fees. Some bookings may require a non-refundable deposit.</p> <h2 data-svelte-h="svelte-115lbmi">Warranty</h2> <p data-svelte-h="svelte-1w34wsf">We stand by our workmanship; see Warranty for details.</p> <h2 data-svelte-h="svelte-1b9aik8">Limitation of liability</h2> <p data-svelte-h="svelte-18idghh">To the maximum extent permitted by law, our liability is limited to amounts paid for the service.</p> <p>Effective date: ${escape((/* @__PURE__ */ new Date()).toISOString().slice(0, 10))}</p>`;
    }
  })}`;
});
export {
  Page as default,
  metadata
};
