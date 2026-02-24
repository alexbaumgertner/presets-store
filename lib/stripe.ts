import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error("STRIPE_SECRET_KEY is required");
}

const stripeConfig: Stripe.StripeConfig = {
  apiVersion: "2025-02-24.acacia"
};

if (process.env.STRIPE_HOST) {
  stripeConfig.host = process.env.STRIPE_HOST;
}

if (process.env.STRIPE_PORT) {
  const port = Number(process.env.STRIPE_PORT);
  if (!Number.isNaN(port)) {
    stripeConfig.port = port;
  }
}

if (process.env.STRIPE_PROTOCOL === "http" || process.env.STRIPE_PROTOCOL === "https") {
  stripeConfig.protocol = process.env.STRIPE_PROTOCOL;
}

export const stripe = new Stripe(secretKey, stripeConfig);
