/** Every product picks exactly one revenue mode. No mode = 'membership' is the intake default (see pmd-factory/CLAUDE.md). */
export const MONETIZATION_MODES = ['ads', 'membership'] as const;
export type MonetizationMode = (typeof MONETIZATION_MODES)[number];

export type PmdConfig = { product: string; supabaseUrl: string; supabaseAnonKey: string; monetization: MonetizationMode };

const SLUG = /^[a-z][a-z0-9_]{1,30}$/;

/** Validates at the trust boundary (env vars). `product` doubles as the Postgres schema name. */
export function createPmdConfig({
  product = '',
  supabaseUrl = '',
  supabaseAnonKey = '',
  monetization = '' as MonetizationMode,
}: Partial<PmdConfig>): PmdConfig {
  const missing = Object.entries({ product, supabaseUrl, supabaseAnonKey, monetization })
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) throw new Error(`PMD config missing: ${missing.join(', ')}`);
  if (!SLUG.test(product)) throw new Error(`PMD product must match ${SLUG}: got "${product}"`);
  if (!MONETIZATION_MODES.includes(monetization as MonetizationMode)) {
    throw new Error(`PMD monetization must be one of ${MONETIZATION_MODES.join('|')}: got "${monetization}"`);
  }
  return { product, supabaseUrl, supabaseAnonKey, monetization: monetization as MonetizationMode };
}
