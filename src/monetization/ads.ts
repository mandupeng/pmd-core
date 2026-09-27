/** Config for 'ads' mode. Slot IDs are data, not code — add a slot by adding a map entry, never a new component. */
export type AdSlots = Record<string, string>;
export type AdSenseConfig = { clientId: string; slots: AdSlots; scriptSrc: string };

const CLIENT_ID = /^ca-pub-\d{16}$/;

/** Validates the AdSense client id at the trust boundary. Rendering (script tag, slot component) lives in @pmd/ui. */
export function createAdSenseConfig(clientId: string, slots: AdSlots = {}): AdSenseConfig {
  if (!CLIENT_ID.test(clientId)) throw new Error(`AdSense clientId must match ${CLIENT_ID}: got "${clientId}"`);
  return { clientId, slots, scriptSrc: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}` };
}
