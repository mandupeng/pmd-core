import type { SupabaseClient } from '@supabase/supabase-js';

/** Adding a provider = one line here (+ enabling it in the Supabase dashboard). */
export const providers = {
  google: { label: 'Google' },
  kakao: { label: '카카오' },
  apple: { label: 'Apple' },
} as const;

export type ProviderName = keyof typeof providers;

export const signInWith = (client: SupabaseClient, provider: ProviderName, redirectTo: string) =>
  client.auth.signInWithOAuth({ provider, options: { redirectTo } });
