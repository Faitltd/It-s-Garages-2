const load = async () => {
  return {
    baseUrl: process.env.BASE_URL || "http://localhost:5173",
    stripeEnabled: Boolean(process.env.STRIPE_SECRET_KEY)
  };
};
export {
  load
};
