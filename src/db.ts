import { createClient } from '@supabase/supabase-js';
import type { PmdConfig } from './config.ts';

/** One shared Supabase project; each product reads/writes only its own schema (must be in "Exposed schemas"). */
export const createPmdClient = ({ product, supabaseUrl, supabaseAnonKey }: PmdConfig) =>
  createClient(supabaseUrl, supabaseAnonKey, { db: { schema: product } });
