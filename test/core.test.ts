import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPmdConfig } from '../src/config.ts';
import { createAnalytics } from '../src/analytics.ts';
import { providers } from '../src/auth/providers.ts';

test('config rejects missing values and unsafe schema names', () => {
  assert.throws(() => createPmdConfig({ product: 'x' }), /missing: supabaseUrl, supabaseAnonKey/);
  assert.throws(() => createPmdConfig({ product: 'a; drop', supabaseUrl: 'u', supabaseAnonKey: 'k' }), /must match/);
  assert.equal(createPmdConfig({ product: 'translator', supabaseUrl: 'u', supabaseAnonKey: 'k' }).product, 'translator');
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
