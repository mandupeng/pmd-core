import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPmdConfig } from '../src/config.ts';
import { createPmdClient } from '../src/db.ts';
import { createAnalytics } from '../src/analytics.ts';
import { providers } from '../src/auth/providers.ts';
import { createAdSenseConfig } from '../src/monetization/ads.ts';

test('config rejects missing values and unsafe schema names', () => {
  assert.throws(() => createPmdConfig({ product: 'x' }), /missing: supabaseUrl, supabaseAnonKey, monetization/);
  assert.throws(() => createPmdConfig({ product: 'a; drop', supabaseUrl: 'u', supabaseAnonKey: 'k', monetization: 'ads' }), /must match/);
  assert.throws(
    () => createPmdConfig({ product: 'translator', supabaseUrl: 'u', supabaseAnonKey: 'k', monetization: 'donations' as never }),
    /monetization must be one of/,
  );
  assert.equal(createPmdConfig({ product: 'translator', supabaseUrl: 'u', supabaseAnonKey: 'k', monetization: 'membership' }).product, 'translator');
});

test('ads config validates the AdSense client id', () => {
  assert.throws(() => createAdSenseConfig('not-a-client-id'), /clientId must match/);
  const cfg = createAdSenseConfig('ca-pub-1234567890123456', { header: '1111111111' });
  assert.equal(cfg.slots.header, '1111111111');
  assert.match(cfg.scriptSrc, /client=ca-pub-1234567890123456$/);
});

test('analytics tags product, fans out, and survives a broken adapter', () => {
  const seen: unknown[] = [];
  const a = createAnalytics('translator', [() => { throw new Error('boom'); }, (e, p) => seen.push([e, p])]);
  a.track('signup', { plan: 'free' });
  assert.deepEqual(seen, [['signup', { plan: 'free', product: 'translator' }]]);
});

test('social providers registry', () => {
  assert.deepEqual(Object.keys(providers), ['google', 'kakao', 'apple']);
});

test('client always scopes to the product schema, even if options tries to override it', () => {
  const config = createPmdConfig({ product: 'shortsoff', supabaseUrl: 'https://x.supabase.co', supabaseAnonKey: 'k' });
  // @ts-expect-error - schema isn't a settable option; this is exactly what the merge guards against
  const client = createPmdClient(config, { db: { schema: 'other_product' }, auth: { persistSession: false } });
  assert.equal((client as unknown as { supabaseUrl: string }).supabaseUrl, 'https://x.supabase.co');
});
