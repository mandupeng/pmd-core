// Structural subset of the Stripe SDK client, not `import type Stripe from 'stripe'` — 'stripe' is an
// optional peer dep, and pmd-core ships raw .ts source, so an 'ads'-only consumer's typecheck must not
// need it installed. A real Stripe client satisfies this shape without any adapter.
export type StripeLike = {
  checkout: { sessions: { create: (params: Record<string, unknown>) => Promise<unknown> } };
  billingPortal: { sessions: { create: (params: Record<string, unknown>) => Promise<unknown> } };
  webhooks: { constructEvent: (payload: string | Buffer, signature: string, secret: string) => unknown };
};

/** Config for 'membership' mode. Adding a tier = one map entry (+ a Price in the Stripe dashboard), never a new code path. */
export type Tier = { label: string; priceId: string };
export type Tiers = Record<string, Tier>;

const tierOrThrow = (tiers: Tiers, tier: string): Tier => {
  const t = tiers[tier];
  if (!t) throw new Error(`Unknown tier "${tier}", expected one of ${Object.keys(tiers).join('|')}`);
  return t;
};

export const createCheckoutSession = (
  stripe: StripeLike,
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

export const createBillingPortalSession = (stripe: StripeLike, { customerId, returnUrl }: { customerId: string; returnUrl: string }) =>
  stripe.billingPortal.sessions.create({ customer: customerId, return_url: returnUrl });

/** Verifies the webhook signature before trusting the payload — never parse Stripe webhook JSON directly. */
export const verifyWebhookEvent = (stripe: StripeLike, { payload, signature, webhookSecret }: { payload: string | Buffer; signature: string; webhookSecret: string }) =>
  stripe.webhooks.constructEvent(payload, signature, webhookSecret);
