import type Stripe from 'stripe';

/** Config for 'membership' mode. Adding a tier = one map entry (+ a Price in the Stripe dashboard), never a new code path. */
export type Tier = { label: string; priceId: string };
export type Tiers = Record<string, Tier>;

const tierOrThrow = (tiers: Tiers, tier: string): Tier => {
  const t = tiers[tier];
  if (!t) throw new Error(`Unknown tier "${tier}", expected one of ${Object.keys(tiers).join('|')}`);
  return t;
};

export const createCheckoutSession = (
  stripe: Stripe,
  { tiers, tier, customerEmail, successUrl, cancelUrl }: {
    tiers: Tiers; tier: string; customerEmail: string; successUrl: string; cancelUrl: string;
  },
) =>
  stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: tierOrThrow(tiers, tier).priceId, quantity: 1 }],
    customer_email: customerEmail,
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

export const createBillingPortalSession = (stripe: Stripe, { customerId, returnUrl }: { customerId: string; returnUrl: string }) =>
  stripe.billingPortal.sessions.create({ customer: customerId, return_url: returnUrl });

/** Verifies the webhook signature before trusting the payload — never parse Stripe webhook JSON directly. */
export const verifyWebhookEvent = (stripe: Stripe, { payload, signature, webhookSecret }: { payload: string | Buffer; signature: string; webhookSecret: string }) =>
  stripe.webhooks.constructEvent(payload, signature, webhookSecret);
