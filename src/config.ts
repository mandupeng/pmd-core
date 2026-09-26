export type PmdConfig = { product: string; supabaseUrl: string; supabaseAnonKey: string };

const SLUG = /^[a-z][a-z0-9_]{1,30}$/;

/** Validates at the trust boundary (env vars). `product` doubles as the Postgres schema name. */
export function createPmdConfig({ product = '', supabaseUrl = '', supabaseAnonKey = '' }: Partial<PmdConfig>): PmdConfig {
  const missing = Object.entries({ product, supabaseUrl, supabaseAnonKey })
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) throw new Error(`PMD config missing: ${missing.join(', ')}`);
  if (!SLUG.test(product)) throw new Error(`PMD product must match ${SLUG}: got "${product}"`);
  return { product, supabaseUrl, supabaseAnonKey };
}
