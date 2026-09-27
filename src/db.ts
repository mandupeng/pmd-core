import { createClient, type SupabaseClientOptions } from '@supabase/supabase-js';
import type { PmdConfig } from './config.ts';

type ClientOptions = Omit<SupabaseClientOptions<string>, 'db'> & {
  db?: Omit<NonNullable<SupabaseClientOptions<string>['db']>, 'schema'>;
};

/**
 * One shared Supabase project; each product reads/writes only its own schema (must be in "Exposed schemas").
 * `options` merges in on top (e.g. React Native needs `auth.storage: AsyncStorage` for session persistence;
 * web/Node are fine with the default). `schema` is always `product` — it isn't a settable option, so a
 * caller can't accidentally point at another product's schema.
 */
export const createPmdClient = (
  { product, supabaseUrl, supabaseAnonKey }: PmdConfig,
  options: ClientOptions = {},
) =>
  createClient(supabaseUrl, supabaseAnonKey, {
    ...options,
    db: { ...options.db, schema: product },
  });
