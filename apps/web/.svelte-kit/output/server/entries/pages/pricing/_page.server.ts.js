import { c as calcTotal, b as buildTiers } from "../../../chunks/pricing.js";
const load = async () => {
  const base = calcTotal({ jobType: "install-door", qty: 1, urgency: "standard" });
  const defaultTiers = buildTiers(base);
  return { defaultTiers, stripeEnabled: Boolean(process.env.STRIPE_SECRET_KEY) };
};
export {
  load
};
