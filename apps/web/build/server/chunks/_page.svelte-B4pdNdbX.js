import { c as create_ssr_component, f as each, e as escape } from './ssr-CNc3xdch.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const features = [
    {
      title: "Instant Estimates",
      desc: "Transparent pricing with Good / Better / Best options."
    },
    {
      title: "Easy Booking",
      desc: "Pick a slot that works. Well confirm ASAP."
    },
    {
      title: "Trusted Pros",
      desc: "Vetted 1099 techs with insurance and background checks."
    }
  ];
  return `<section class="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black"><div class="max-w-6xl mx-auto px-6 py-20 text-center"><h1 class="text-4xl md:text-6xl font-bold tracking-tight" data-svelte-h="svelte-7eyszv">Fast, Fair Garage Door Service</h1> <p class="mt-4 text-lg opacity-80" data-svelte-h="svelte-13nytm7">Get an instant estimate, book online, and well handle the rest.</p> <div class="mt-8 flex items-center justify-center gap-4"><a class="px-6 py-3 rounded bg-black text-white dark:bg-white dark:text-black" href="/pricing" data-svelte-h="svelte-o0r9r7">Get an instant estimate</a> <a class="px-6 py-3 rounded border" href="/book" data-svelte-h="svelte-3q94w5">Book now</a></div></div></section> <section class="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6">${each(features, (f) => {
    return `<div class="rounded-lg border p-6"><h3 class="font-semibold">${escape(f.title)}</h3> <p class="opacity-80 mt-2 text-sm">${escape(f.desc)}</p> </div>`;
  })}</section>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-B4pdNdbX.js.map
